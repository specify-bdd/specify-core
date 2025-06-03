#!/bin/bash

echo "Removing node_modules and dist folders..."
rm -rf node_modules/
rm -rf **/node_modules
rm -rf **/dist

echo "Removing tsbuildinfo files..."
rm -f **/*.tsbuildinfo

echo ""
echo "Reset complete. Don't forget to run 'pnpm install' to restore dependencies."
echo ""
