#!/bin/bash

echo "Removing node_modules and dist folders..."
rm -rf node_modules/
find modules/ -type d \( -name dist -o -name node_modules \) -exec rm -rf {} +

echo "Removing tsbuildinfo files..."
find . -type f -name tsconfig*.tsbuildinfo -exec rm -f {} +

echo ""
echo "Reset complete. Don't forget to run 'pnpm install' to restore dependencies."
echo ""
