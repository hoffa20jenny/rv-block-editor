import Editor from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import blockRenderMap from './blockRenderMap'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import InlineStyleMenu from './InlineStyleMenu'
import PlusMenu from './PlusMenu'
import DragOverlay from './DragOverlay'

import styles from './styles.module.scss'


export default function _BlockEditor ( props ) {
    const { editorState, setEditorState, plugins } = useEditorContext ()
    const { editorRef, wrapperRef, setPlusMenuInfo } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()

    return <div onClick = { () => editorRef.current?.focus () }>
        <div className = { styles.editorWrapper } ref = { wrapperRef }>
            <Editor
                ref = { editorRef }
                editorState = { editorState }
                onChange = { setEditorState }
                plugins = { plugins }
                handleKeyCommand = { handleKeyCommand }
                customStyleMap = { customStyleMap }
                blockRenderMap = { blockRenderMap }
                onEscape = { () => {
                    setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
                } }
                { ...props }
            />
            <InlineStyleMenu />
            <PlusMenu />
            <DragOverlay />
        </div>
    </div>
}
