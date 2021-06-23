import { useState } from 'react'
import cn from 'classnames'
import useUiContext from 'BlockEditor/UiContext'

import DragHandle from 'BlockEditor/DragOverlay/DragHandle'
import getWrapperHandlers from 'BlockEditor/DragOverlay/getWrapperHandlers'
import PlusMenuButton from 'BlockEditor/PlusMenuButton'

import styles from './styles.module.scss'


const BlockWrapper = ({ Comp, ...props }) => {
    const { children } = props
    const { props: { block } } = children
    const { setDragInfo, blockRefs } = useUiContext ()
    const [ isDragging, setIsDragging ] = useState ( false )
    return <div
        ref = { elem => blockRefs.current [ block.key ] = elem }
        data-block-key = { block.key }
        className = { cn ( styles.blockWrapper, {
            [ styles.dragging ]: isDragging
        } ) }
        draggable = { isDragging }
        { ...getWrapperHandlers ({ setIsDragging, setDragInfo }) }
    >
        <div className = { styles.controls }>
            <PlusMenuButton block = { block } />
            <DragHandle setIsDragging = { setIsDragging } />
        </div>
        <div className = { styles.content }>
            <Comp children = { children } />
        </div>
    </div>
}
export default BlockWrapper

export const withBlockWrapper = Comp => props => <BlockWrapper
    Comp = { Comp }
    { ...props }
/>
