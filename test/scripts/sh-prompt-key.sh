#!/bin/sh

printf "Press test key\n"

trap 'stty sane' EXIT

stty -icanon -echo min 1 time 0

key=$(dd bs=1 count=1 2>/dev/null)

stty sane
trap - EXIT

case "$key" in
  "$(printf '\t')") key_name="Tab" ;;
  "$(printf '\n')") key_name="Enter" ;;
  " ") key_name="Space" ;;
  *) key_name="$key" ;;
esac

printf "Key pressed: %s\n" "$key_name"