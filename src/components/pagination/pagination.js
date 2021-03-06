import Vue from '../../utils/vue'
import { getComponentConfig } from '../../utils/config'
import { isVisible } from '../../utils/dom'
import paginationMixin from '../../mixins/pagination'

const NAME = 'BPagination'

const DEFAULT_PER_PAGE = 20
const DEFAULT_TOTAL_ROWS = 0

// Sanitize the provided per page number (converting to a number)
const sanitizePerPage = val => {
  const perPage = parseInt(val, 10) || DEFAULT_PER_PAGE
  return perPage < 1 ? 1 : perPage
}

// Sanitize the provided total rows number (converting to a number)
const sanitizeTotalRows = val => {
  const totalRows = parseInt(val, 10) || DEFAULT_TOTAL_ROWS
  return totalRows < 0 ? 0 : totalRows
}

const props = {
  size: {
    type: String,
    default: () => getComponentConfig(NAME, 'size')
  },
  perPage: {
    type: [Number, String],
    default: DEFAULT_PER_PAGE
  },
  totalRows: {
    type: [Number, String],
    default: DEFAULT_TOTAL_ROWS
  },
  ariaControls: {
    type: String,
    default: null
  }
}

// The render function is brought in via the pagination mixin
// @vue/component
export const BPagination = /*#__PURE__*/ Vue.extend({
  name: NAME,
  mixins: [paginationMixin],
  props,
  computed: {
    numberOfPages() {
      const result = Math.ceil(sanitizeTotalRows(this.totalRows) / sanitizePerPage(this.perPage))
      return result < 1 ? 1 : result
    }
  },
  watch: {
    numberOfPages(newVal) {
      if (newVal === this.localNumberOfPages) {
        /* istanbul ignore next */
        return
      }
      this.localNumberOfPages = newVal
      this.currentPage = 1
    }
  },
  created() {
    // Set the initial page count
    this.localNumberOfPages = this.numberOfPages
    // Set the initial page value
    const currentPage = parseInt(this.value, 10) || 0
    if (currentPage > 0) {
      this.currentPage = currentPage
    } else {
      this.$nextTick(() => {
        // If this value parses to NaN or a value less than 1
        // Trigger an initial emit of 'null' if no page specified
        this.currentPage = 0
      })
    }
  },
  mounted() {
    // Set the initial page count
    this.localNumberOfPages = this.numberOfPages
  },
  methods: {
    // These methods are used by the render function
    onClick(num, evt) {
      // Handle edge cases where number of pages has changed (i.e. if perPage changes)
      // This should normally not happen, but just in case.
      if (num > this.numberOfPages) {
        /* istanbul ignore next */
        num = this.numberOfPages
      } else if (num < 1) {
        /* istanbul ignore next */
        num = 1
      }
      // Update the v-model
      this.currentPage = num
      // Emit event triggered by user interaction
      this.$emit('change', this.currentPage)
      this.$nextTick(() => {
        // Keep the current button focused if possible
        const target = evt.target
        if (isVisible(target) && this.$el.contains(target) && target.focus) {
          target.focus()
        } else {
          this.focusCurrent()
        }
      })
    },
    makePage(pageNum) {
      return pageNum
    },
    linkProps(pageNum) {
      // Always '#' for pagination component
      return { href: '#' }
    }
  }
})

export default BPagination
