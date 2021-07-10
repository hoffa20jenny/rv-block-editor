import { createContext, useContext, FC, useMemo } from 'react'
import { EditorPlugin, TransformedInlineStyle, TransformedPlusAction } from 'BlockEditor'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import createBlockBreakoutPlugin from 'BlockEditor/InternalPlugins/BlockBreakout'
import createUiHandlerPlugin from 'BlockEditor/InternalPlugins/UiHandler'


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
     * TODO:
     */
     allPlugins: EditorPlugin []
}

/**
 * TODO:
 */
export const TransformedPluginsContext = createContext < TransformedPluginsContext > ( null )
export const useTransformedPluginsContext = () => useContext ( TransformedPluginsContext )
export default useTransformedPluginsContext

export interface TransformedPluginsContextProviderProps {
    plugins: EditorPlugin []
}

export const TransformedPluginsContextProvider: FC < TransformedPluginsContextProviderProps > = ({ plugins, children }) => {
    const { dict, lang, setPlusActionMenuInfo } = useUiContext ()

    const inlineStyles: TransformedInlineStyle [] = useMemo ( () =>
        plugins.reduce ( ( acc, plugin ) =>
            [ ...acc, ...( plugin.inlineStyles || [] ) ]
        , [] )
    , [ plugins ] )

    const plusActions: TransformedPlusAction [] = useMemo ( () =>
        plugins.reduce ( ( acc, plugin ) => [
            ...acc, ...( plugin.plusActions?.map ( plusAction => ({
                ...plusAction,
                label: dict [ lang ] [ `plugins.${ plugin.id }.${ plusAction.action }` ]
            }) ) || [] )
        ], [] )
    , [ plugins, dict, lang ] )

    const allPlugins = useMemo ( () => {
        const blockBreakoutPlugin = createBlockBreakoutPlugin ({ plusActions })
        const uiHandlerPlugin = createUiHandlerPlugin ({ setPlusActionMenuInfo })
        return [ ...plugins, blockBreakoutPlugin, uiHandlerPlugin ]
    }, [ plusActions ] )

    return <TransformedPluginsContext.Provider
        value = {{ inlineStyles, plusActions, allPlugins }}
        children = { children }
    />
}
