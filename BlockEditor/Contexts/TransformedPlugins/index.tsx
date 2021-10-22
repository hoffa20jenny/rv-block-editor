import { createContext, useContext, FC, useMemo, useRef, useEffect } from 'react'

import { EditorPlugin, EditorPluginObject, EditorPluginFunctionArg, TransformedInlineStyle, TransformedPlusAction } from 'BlockEditor'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import createNestingPlugin from './InternalPlugins/Nesting'
import createBlockBreakoutPlugin from './InternalPlugins/BlockBreakout'
import createUiHandlerPlugin from './InternalPlugins/UiHandler'


export interface TransformedPluginsContext {
    /**
     * All the Inline Styles extracted from plugins
     */
    inlineStyles: TransformedInlineStyle []
    /**
     * All the Plus Actions extracted from plugins
     */
    plusActions: TransformedPlusAction []
    /**
     * All the external and internal plugins ready to be fed to the Plugin Editor.
     */
    allPlugins: EditorPluginObject []
}

export const TransformedPluginsContext = createContext < TransformedPluginsContext > ( null )
export const useTransformedPluginsContext = () => useContext ( TransformedPluginsContext )
export default useTransformedPluginsContext

export interface TransformedPluginsContextProviderProps {
    plugins: EditorPlugin []
}

/**
 * Transformes external plugins, utilizes internal plugins & provides access to them all.
 */
export const TransformedPluginsContextProvider: FC < TransformedPluginsContextProviderProps > = ({ plugins, children }) => {
    const uiContext = useUiContext ()
    const { dict, lang } = uiContext
    const uiContextRef = useRef ( uiContext )
    useEffect ( () => void ( uiContextRef.current = uiContext ), [ uiContext ] )

    const pluginArgs = useMemo < EditorPluginFunctionArg > ( () => ({
        getUiContext: () => uiContextRef.current
    }), [] )

    const pluginObjects = useMemo < EditorPluginObject [] > ( () => toPluginObject ( plugins, pluginArgs ) , [ plugins ] )

    const inlineStyles: TransformedInlineStyle [] = useMemo ( () =>
        pluginObjects.reduce ( ( acc, plugin ) =>
            [ ...acc, ...( plugin.inlineStyles || [] ) ]
        , [] )
    , [ pluginObjects ] )

    const plusActions: TransformedPlusAction [] = useMemo ( () =>
        pluginObjects.reduce ( ( acc, plugin ) => [
            ...acc, ...( plugin.plusActions?.map ( plusAction => ({
                ...plusAction,
                label: dict [ lang ] [ `plugins.${ plugin.id }.${ plusAction.action }` ]
            }) ) || [] )
        ], [] )
    , [ pluginObjects, dict, lang ] )

    const allPlugins = useMemo ( () => {
        const nestingPlugin = createNestingPlugin ()
        const blockBreakoutPlugin = createBlockBreakoutPlugin ({ plusActions })
        const uiHandlerPlugin = createUiHandlerPlugin ()

        const internalPlugins = [ nestingPlugin, blockBreakoutPlugin, uiHandlerPlugin ]
        const internalPluginObjects = toPluginObject ( internalPlugins, pluginArgs )
        return [ ...pluginObjects, ...internalPluginObjects ]
    }, [ pluginObjects, plusActions ] )

    return <TransformedPluginsContext.Provider
        value = {{ inlineStyles, plusActions, allPlugins }}
        children = { children }
    />
}

function toPluginObject ( plugins: EditorPlugin [], args: EditorPluginFunctionArg ): EditorPluginObject [] {
    return plugins.map ( plugin => typeof plugin === 'function' ? plugin ( args ) : plugin )
}
