import { useState, useEffect, useCallback } from 'react'
import { ContentState, SelectionState } from 'draft-js'


// Real-Time Selection State
export interface RtblSelectionState {
    anchorKey: string
    focusKey: string
    startKey: string
    endKey: string
    // isBackward only takes blocks into account and is false for any in-block selection
    isBackward: boolean
}

const defaultRtblSelectionState: RtblSelectionState = {
    anchorKey: '', focusKey: '',
    startKey: '', endKey: '',
    isBackward: false,
}

export default function useRtblSelectionState (
    contentState: ContentState,
    selectionState: SelectionState
): [ RtblSelectionState, SetState < RtblSelectionState >, () => void ] {
    const [ rtblSelectionState, setRtblSelectionState ] = useState ( defaultRtblSelectionState )

    const updateRtblSelectionState = useCallback ( () => {
        const domSelection = getSelection ()
        setRtblSelectionState ( calcRtblSelectionState ( contentState, domSelection ) )
    }, [ setRtblSelectionState ] )

    const hasFocus = selectionState.getHasFocus ()
    useEffect ( () => {
        if ( ! hasFocus ) return
        document.addEventListener ( 'selectionchange', updateRtblSelectionState )
        return () => document.removeEventListener ( 'selectionchange', updateRtblSelectionState )
    }, [ hasFocus ] )

    return [ rtblSelectionState, setRtblSelectionState, updateRtblSelectionState ]
}

export function calcRtblSelectionState ( contentState: ContentState, domSelection: Selection ): RtblSelectionState {
    const anchorKey = getParentBlockKey ( domSelection.anchorNode )
    const focusKey = getParentBlockKey ( domSelection.focusNode )
    const isBackward = calcIsBackward ( contentState, anchorKey, focusKey )
    return {
        anchorKey, focusKey, isBackward,
        startKey: isBackward ? focusKey : anchorKey,
        endKey: isBackward ? anchorKey : focusKey
    }
}

export function getParentBlockKey ( node: Node ): string | null {
    const parentBlock = node.parentElement.closest ( '[data-block-key]' )
    if ( ! parentBlock ) return null
    const blockKey = parentBlock.getAttribute ( 'data-block-key' )
    return blockKey
}

export function calcIsBackward ( contentState: ContentState, anchorKey: string, focusKey: string ) {
    if ( ! anchorKey || ! focusKey ) return false
    if ( anchorKey === focusKey ) return false
    const blockMap = contentState.getBlockMap ()
    const startKey = blockMap.toSeq ().skipUntil ( ( _, key ) => key === anchorKey || key === focusKey ).first ().getKey ()
    const isBackward = anchorKey !== startKey
    return isBackward
}
