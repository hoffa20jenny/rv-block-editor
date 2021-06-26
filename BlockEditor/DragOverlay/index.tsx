import { FC, useState, useCallback } from 'react'
import cn from 'classnames'
import { EditorState } from 'draft-js'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import moveBlock from 'BlockEditor/lib/moveBlock'

import DropIndicator from './DropIndicator'
import findClosestDropElement from './findClosestDropElement'

import styles from './styles.module.scss'


const DragOverlay: FC < any > = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dragInfo, blockRefs, wrapperRef } = useUiContext ()

    const [ overlayRect, setOverlayRect ] = useState ( null )
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
            setOverlayRect ( wrapperRef.current.getBoundingClientRect () )
            const elems = Object.values ( blockRefs.current ).filter ( Boolean )
            const posInfo = elems.map ( elem => {
                const rect = elem.getBoundingClientRect ()
                const centerY = rect.y + rect.height / 2
                return { elem, rect, centerY }
            } )
            const sortedPosInfo = posInfo.slice ().sort ( ( a, b ) => a.centerY - b.centerY )
            setSortedPosInfo ( sortedPosInfo )
        } }
        onDragOver = { event => {
            event.preventDefault ()
            setClosestInfo ( getClosestInfo ( event ) )
        } }
        onDrop = { event => {
            const { elem: closestElem, insertionMode } = getClosestInfo ( event )
            const currentContent = editorState.getCurrentContent ()
            const newContent = moveBlock (
                currentContent,
                currentContent.getBlockForKey ( dragInfo.elem.getAttribute ( 'data-block-key' ) ),
                currentContent.getBlockForKey ( closestElem  .getAttribute ( 'data-block-key' ) ),
                insertionMode
            )
            const newState = EditorState.push ( editorState, newContent, 'move-block' )
            setEditorState ( newState )
        } }
    >
        <DropIndicator
            overlayRect = { overlayRect }
            closestInfo = { closestInfo }
        />
    </div>
}
export default DragOverlay
