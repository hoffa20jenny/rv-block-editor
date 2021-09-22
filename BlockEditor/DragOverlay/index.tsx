import { FC, useState, useCallback } from 'react'
import cn from 'classnames'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import DropIndicator from './DropIndicator'
import findClosestDropElement from './findClosestDropElement'
import handleDrop from './handleDrop'

import styles from './styles.module.scss'


/**
 * This componen overlays the entire outer wrapper when the user starts dragging a Content Block
 * and handles most of the dragging functionality and UI.
 */
const DragOverlay: FC < any > = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dragInfo, blockRefs, wrapperRef, innerWrapperRef, setBlockControlsInfo, blockLevelSelectionInfo } = useUiContext ()

    const [ wrapperRect, setWrapperRect ] = useState ( null )
    const [ innerWrapperRect, setInnerWrapperRect ] = useState ( null )
    const [ sortedPosInfo, setSortedPosInfo ] = useState ( null )
    const [ closestInfo, setClosestInfo ] = useState ( null )

    const getClosestInfo = useCallback ( event => {
        if ( ! sortedPosInfo )
            return null
        return findClosestDropElement ( event, sortedPosInfo )
    }, [ sortedPosInfo ] )

    return <div
        className = { cn ( styles.dragOverlay, {
            [ styles.dragging ]: dragInfo.dragging && dragInfo.isDraggingByHandle
        } ) }
        onDragEnter = { () => {
            const blockMap = editorState.getCurrentContent ().getBlockMap ()
            const sortedPosInfo = blockMap.map ( ( contentBlock, blockKey ) => {
                const elem = blockRefs.current [ blockKey ]
                const rect = elem.getBoundingClientRect ()
                const centerY = rect.y + rect.height / 2
                return { blockKey, contentBlock, elem, rect, centerY }
            } ).toArray ()

            setSortedPosInfo ( sortedPosInfo )
            setWrapperRect ( wrapperRef.current.getBoundingClientRect () )
            setInnerWrapperRect ( innerWrapperRef.current.getBoundingClientRect () )
        } }
        onDragOver = { event => {
            event.preventDefault ()
            setClosestInfo ( getClosestInfo ( event ) )
        } }
        onDrop = { event => {
            const { elem: closestElem, insertionMode } = getClosestInfo ( event )
            const draggedBlockKey = dragInfo.elem.getAttribute ( 'data-block-key' )
            const dropTargetKey = closestElem.getAttribute ( 'data-block-key' )
            const newState = handleDrop ( editorState, blockLevelSelectionInfo, draggedBlockKey, dropTargetKey, insertionMode )

            setEditorState ( newState )
            setWrapperRect ( null )
            setInnerWrapperRect ( null )
            setSortedPosInfo ( null )
            setClosestInfo ( null )
            setImmediate ( () => setBlockControlsInfo ( prev => ({ ...prev,
                hoveredBlockElem: dragInfo.elem as any,
                hoveredBlockKey: draggedBlockKey
            }) ) )
        } }
    >
        <DropIndicator
            draggingBlockKey = { dragInfo?.block?.getKey () }
            wrapperRect = { wrapperRect }
            innerWrapperRect = { innerWrapperRect }
            closestInfo = { closestInfo }
        />
    </div>
}
export default DragOverlay
