import _ from 'lodash'
import cn from 'classnames'
import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import mergeBlockDataByKey from 'BlockEditor/Lib/mergeBlockDataByKey'

import _createCheckableListPlugin from 'draft-js-checkable-list-plugin'
import 'draft-js-checkable-list-plugin/lib/plugin.css'

import { CheckableListIcon } from './icons'
import styles from './styles.module.scss'


const _plugin = _createCheckableListPlugin ()
const _checkableListItem = _plugin.blockRenderMap.get ( 'checkable-list-item' )

export default function createCheckableListPlugin ( config: any = {} ): EditorPlugin {
    return {
        id: 'checkable-list',

        ..._.omit ( _plugin, [ 'onTab' ] ),

        blockRenderMap: Map ({
            'checkable-list-item': {
                ..._checkableListItem,
                element: withBlockWrapper ( _checkableListItem.element ),
                wrapper: {
                    ..._checkableListItem.wrapper,
                    props: {
                        ..._checkableListItem.wrapper.props,
                        className: cn ( _checkableListItem.wrapper.props.className, config.styles?.cl, styles.cl )
                    }
                }
            }
        }),

        blockRendererFn ( contentBlock, pfs ) {
            const original = _plugin.blockRendererFn ( contentBlock, pfs )
            if ( ! original ) return
            const checked = contentBlock.getData ().get ( 'checked' )
            return {
                ...original,
                props: {
                    ...original.props,
                    onChangeChecked () {
                        const editorState = pfs.getEditorState ()
                        const newEditorState = mergeBlockDataByKey ( editorState, contentBlock.getKey (), { checked: ! checked } )
                        pfs.setEditorState ( newEditorState )
                    }
                }
            }
        },

        plusActions: [
            { action: 'checkable-list-item', Icon: CheckableListIcon }
        ]
    }
}
