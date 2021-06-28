import { createContext, useContext } from 'react'
import { EditorState } from 'draft-js'


export interface EditorContext {
    editorState: EditorState,
    setEditorState: SetState < EditorState >,
}

/**
 * Provides access to the general state of the editor in nested components.
 */
export const EditorContext = createContext < EditorContext > ( null )
export const useEditorContext = () => useContext ( EditorContext )
export default useEditorContext

export function EditorContextProvider ({ editorState, setEditorState, ...rest }) {
    return <EditorContext.Provider
        value = {{ editorState, setEditorState }}
        { ...rest }
    />
}
