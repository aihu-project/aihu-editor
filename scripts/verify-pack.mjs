import { resolve } from 'node:path'
import { verifyPackage } from './verify-pack-contract.mjs'

verifyPackage(resolve('.'), process.env.PACK_DIR ?? '.release/pack')
