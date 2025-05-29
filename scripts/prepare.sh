#!/bin/bash

# build workspaces in sequential order to avoid race conditions on dependencies
pnpm -r --filter ./quick-ref run build
pnpm -r --filter ./runner run build
pnpm -r --filter ./runner-plugin-cli run build
