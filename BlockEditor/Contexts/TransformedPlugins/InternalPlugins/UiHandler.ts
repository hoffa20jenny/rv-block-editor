import { EditorState, SelectionState } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'
import { defaultBlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'


/**
 * Provides some User Interface functionality and keyboard shortcuts.
 */
export default function createUiHandlerPlugin (): EditorPlugin {
    return ({ getUiContext }) => ({
        id: '__internal__ui-handler',

        keyBindingFn ( event ) {
            const { plusActionMenuInfo, blockLevelSelectionInfo } = getUiContext ()

            // if ( blockLevelSelectionInfo.enabled ) {
            //     if ( event.key === 'Escape' )
            //         return 'disable-blockLevelSelection'
            //     if ( event.ctrlKey ) {
            //         return {
            //             c: 'blockLevel-copy',
            //             x: 'bockLevel-cut',
            //             v: 'blockLevel-paste'
            //         } [ event.key ]
            //     }
            //     return 'blockLevel-ignoredKey'
            // }

            if ( plusActionMenuInfo.openedBlock ) {
                if ( event.key === 'Escape' )
                    return 'close-plusActionMenu'
            }

            return undefined
        },

        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            const { setPlusActionMenuInfo, setBlockLevelSelectionInfo, updateRtblSelectionState } = getUiContext ()

            return {
                'close-plusActionMenu' () {
                    setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
                    return 'handled'
                },

                'disable-blockLevelSelection' () {
                    const selection = editorState.getSelection ()
                    const newSelection = new SelectionState ({
                        anchorKey: selection.getAnchorKey (), anchorOffset: selection.getAnchorOffset (),
                        focusKey: selection.getAnchorKey (), focusOffset: selection.getAnchorOffset (),
                        isBackward: false, hasFocus: true
                    })
                    const newEditorState = EditorState.forceSelection ( editorState, newSelection )

                    setEditorState ( newEditorState )
                    setImmediate ( () => {
                        updateRtblSelectionState ()
                        setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
                    } )

                    return 'handled'
                },

                'blockLevel-copy' () {
                    console.log ( 'blc' )
                    return 'handled'
                },

                'bockLevel-cut' () {
                    console.log ( 'blx' )
                    return 'handled'
                },

                'blockLevel-paste' () {
                    console.log ( 'blv' )
                    return 'handled'
                },

                'blockLevel-ignoredKey' () {
                    return 'handled'
                }
            } [ command ]?.() || 'not-handled'
        }
    })
}
