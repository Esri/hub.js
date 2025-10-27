#!/bin/bash
# Usage: ./rename-tests.sh /path/to/folder

dir="${1:-.}"  # default to current directory if none given

find "$dir" -type f -name "*.test.ts" | while read -r file; do
  new="${file%.test.ts}.spec.ts"
  mv "$file" "$new"
  echo "Renamed: $file → $new"
done
