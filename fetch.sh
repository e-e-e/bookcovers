#!/usr/bin/env bash
#
# A script to fetch and save the largest thumbnail image for a book with matching ISBN.
#
set -eu
set -o pipefail

function usage () {
  cat <<EOF
  Usage: bookcovers-save <isbn>
EOF
}

err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: $@" >&2
}

function main () {
  if [[ "$*" =~ ^(-h|--help)$ ]]; then
    usage
    exit
  fi
  if [[ "$#" != 1 ]]; then
    echo "Expect first arguement to be an ISBN number."
    exit 1
  fi
  ISBN="$1";
  WORK_DIR=$(mktemp -d);
  trap 'rm -rf "${WORK_DIR}"' EXIT
  pushd "$WORK_DIR"
  # Download all images associated with isbn number
  echo "Finding images for $ISBN";
  bookcovers "$ISBN" | awk '{print $3}' | xargs -n 1 curl -L -# -O;
  echo "Finding largest image from files downloaded."
  local max_resolution=0;
  local file='';
  for f in * ; do
    if [[ "$f" == "*" ]]; then
      continue;
    fi
    local image_data;
    local res;
    image_data=($(set -e; gm identify -format '%w,%h,%m' "$f" | tr "," "\n"))
    if [[ ! "${image_data[2]}" =~ ^(PNG|JPE?G|WEBP)$ ]]; then
      continue;
    fi
    res=$(( image_data[0] * image_data[1] ))
    if (( res > max_resolution )); then
      max_resolution=${res};
      file=${f};
    fi
  done 
  popd
  if [[ -z "$file" ]]; then
    err "No image found!"
    exit 1
  fi
  echo "Saving largest image as JPEG"
  gm convert -format jpeg "$WORK_DIR/$file" "$ISBN.jpg" 
  echo "Saved image to ./$ISBN.jpg"
}

main "$@";