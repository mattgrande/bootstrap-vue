import Vue from '../../utils/vue'
import { mergeData } from 'vue-functional-data-merge'

export const props = {
  tag: {
    type: String,
    default: 'div'
  }
}

// @vue/component
export const BInputGroupText = /*#__PURE__*/ Vue.extend({
  name: 'BInputGroupText',
  functional: true,
  props,
  render(h, { props, data, children }) {
    return h(
      props.tag,
      mergeData(data, {
        staticClass: 'input-group-text'
      }),
      children
    )
  }
})

export default BInputGroupText
