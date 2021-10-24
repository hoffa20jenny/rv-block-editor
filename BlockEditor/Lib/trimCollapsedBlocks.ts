import { BlockMap, BlockMapBuilder } from 'draft-js'

import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'


export default function trimCollapsedBlocks ( blockMap: BlockMap ): BlockMap {
    if ( ! blockMap.size ) return blockMap
    const safeLeft = blockMap.takeUntil ( b => !! b.getData ().get ( '_collapsed' ) ) as BlockMap
    const lastSafeBlockKey = safeLeft.last ()?.getKey ()
    const right = blockMap.skipUntil ( b => b.getKey () === lastSafeBlockKey ).skip ( 1 ) as BlockMap
    const firstCollapsedBlock = right.first ()
    if ( ! firstCollapsedBlock?.getData ().get ( '_collapsed' ) ) return safeLeft
    const lastCollapsedKey = getLastCousinShallowerThan (
        right,
        firstCollapsedBlock.getKey (),
        firstCollapsedBlock.getDepth ()
    ).getKey ()
    const rest = blockMap.skipUntil ( b => b.getKey () === lastCollapsedKey ).skip ( 1 ) as BlockMap
    return safeLeft.merge ( BlockMapBuilder.createFromArray ([ firstCollapsedBlock ]), trimCollapsedBlocks ( rest ) )
}
