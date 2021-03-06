import { forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'
import { IconType } from 'react-icons'
import { motion } from 'framer-motion'

import styles from './styles.module.scss'


export interface ButtonProps extends HTMLAttributes < HTMLDivElement > {
    Icon?: IconType
    active?: boolean
    noMotion?: boolean
    [ key: string ]: any
}

/**
 * Generic button UI element.
 */
const Button = forwardRef < HTMLDivElement, ButtonProps > ( (
    { className, Icon, active, noMotion, children, ...props }: any, ref
) => {
    const Comp = noMotion ? 'div' : motion.div
    return <Comp
        ref = { ref }
        className = { cn ( styles.button, className, {
            [ styles.active ]: active
        } ) }
        onMouseDown = { e => e.preventDefault () }
        { ...props }
    >
        { Icon && <Icon /> }
        { children && <span children = { children } /> }
    </Comp>
} )
export default Button
