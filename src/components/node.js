'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import NodeHeader from './header';

class TreeNode extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const {node, onToggle} = this.props;

        if (onToggle) onToggle(node, !node.toggled);
    }

    animations() {
        const {animations, node} = this.props;

        if (animations === false) return false;

        const anim = Object.assign({}, animations, node.animations);
        return {
            toggle: anim.toggle(this.props),
            drawer: anim.drawer(this.props)
        };
    }

    decorators() {
        // Merge Any Node Based Decorators Into The Pack
        const {decorators, node} = this.props;
        let nodeDecorators = node.decorators || {};

        return Object.assign({}, decorators, nodeDecorators);
    }

    render() {
        const {style} = this.props;
        const decorators = this.decorators();
        const animations = this.animations();

        return (
            <li ref={ref => this.topLevelRef = ref}
                style={style.base}>
                {this.renderHeader(decorators, animations)}

                {this.renderDrawer(decorators, animations)}
            </li>
        );
    }

    renderDrawer(decorators, animations) {
        const {node} = this.props;

        if (node.toggled) return this.renderChildren(decorators, animations);
    }

    renderHeader(decorators, animations) {
        const {node, style, depth} = this.props;

        return (
            <NodeHeader animations={animations}
                        decorators={decorators}
                        node={Object.assign({}, node)}
                        onClick={this.onClick}
                        style={style}
                        depth={depth} />
        );
    }

    renderChildren(decorators) {
        const {animations, decorators: propDecorators, node, style, depth} = this.props;

        if (node.loading) {
            return this.renderLoading(decorators);
        }

        let children = node.children;
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }

        return (
            <ul style={style.subtree}
                ref={ref => this.subtreeRef = ref}>
                {children.map((child, index) => <TreeNode {...this._eventBubbles()}
                                                          animations={animations}
                                                          decorators={propDecorators}
                                                          key={child.id || index}
                                                          node={child}
                                                          style={style}
                                                          depth={depth + 1} />
                )}
            </ul>
        );
    }

    renderLoading(decorators) {
        const {style} = this.props;

        return (
            <ul style={style.subtree}>
                <li>
                    <decorators.Loading style={style.loading}/>
                </li>
            </ul>
        );
    }

    _eventBubbles() {
        const {onToggle} = this.props;

        return {
            onToggle
        };
    }
}

TreeNode.propTypes = {
    style: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]).isRequired,
    onToggle: PropTypes.func,
    depth: PropTypes.number.isRequired
};

export default TreeNode;
