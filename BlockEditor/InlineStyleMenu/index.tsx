import { FC, useState, useMemo } from 'react'
import { RichUtils } from 'draft-js'
import { getSelectionInlineStyle } from 'draftjs-utils'
import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import { usePopper } from 'react-popper'
import Button from 'BlockEditor/Ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles.module.scss'


const InlineStyleMenu: FC = () => {
    return <AnimatePresence children = { useUiContext ().inlineStyleMenuInfo.isOpen && <Menu /> } />
}
export default InlineStyleMenu

function Menu () {
    const { editorState, setEditorState, inlineStyles } = useEditorContext ()
    const { inlineStyleMenuInfo: { getSelectionRect, domSelection }, dir } = useUiContext ()
    const [ menuRef, setMenuRef ] = useState < HTMLDivElement > ( null )
    const virtualReference = useMemo ( () => ({
        getBoundingClientRect: () => getSelectionRect () || new DOMRect ()
    }), [ getSelectionRect, domSelection ] )
    const popper = usePopper ( virtualReference, menuRef, { placement: `top-${ { ltr: 'start', rtl: 'end' } [ dir ] }` as any } )
    const activeInlineStyles = getSelectionInlineStyle ( editorState )
    return <motion.div
        initial = 'initial' animate = 'animate' exit = 'exit'
        variants = {{ initial: {}, animate: {}, exit: {} }}
        transition = {{ staggerChildren: .02 }}
        className = { styles.inlineStyleMenu }
        ref = { setMenuRef }
        style = { popper.styles.popper }
        { ...popper.attributes.popper }
    >
        <Overlay
            className = { styles.overlay }
            style = {{
                transform: `translateY( calc( ${ popper.styles.popper.top === '0' ? 1 : -1 } * .3rem ) )`
            }}
        >
            { inlineStyles.map ( ({ Icon, style }) => <motion.div
                key = { style }
                variants = {{
                    initial: { opacity: 0, scale: .4 },
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <Button
                    Icon = { Icon }
                    active = { activeInlineStyles [ style ] }
                    onClick = { () => {
                        const newEditorState = RichUtils.toggleInlineStyle ( editorState, style )
                        setEditorState ( newEditorState )
                    } }
                />
            </motion.div> ) }
        </Overlay>
    </motion.div>
}
