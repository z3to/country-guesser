<template>
  <div class="wrapper" ref="vis">
    <resize-observer @notify="handleResize" />
    <Tooltip
      v-if="hoverCountry"
      :dimensions="resolution"
      :country="hoverCountry" />
    <svg class="vis-legend">
      <text
        v-for="item in legendPlacements"
        :y="item.y"
        :x="item.x"
        dominant-baseline="middle"
        text-anchor="middle"
        :transform="'rotate(90,' + item.x + ',' + item.y + ')'"
      >{{ item.label }}</text>
    </svg>
    <svg
      v-if="resolution.length && Math.min(...resolution) > 500"
      :class="{ highlight: activeStatus !== 'default', 'vis-graphic': true, 'negative': activeColour === 'rankDiff1712' || activeColour === 'rankDiff1706' || activeColour === 'scoreDiff1712' || activeColour === 'scoreDiff1706' }">
      <g v-on:mouseleave="makeHoverCountry(false)">
        <g
          v-for="(country, index) in countries"
          :key="country.cca3"
          :class="{ 'country': true, 'highlight': status[activeStatus][index], 'active': checkActive(activeCountry, country) }"
          v-on:mouseover="makeHoverCountry({ country: country, placement: placements[index] })">
          <path
            v-if="shapes.length"
            :style="{ fill: country.colours[activeColour] }"
            :d="shapes[index]" />
          <text
            v-for="(placement, n) in placements[index]"
            v-if="points.length && placement[2] > 7 && placement[3] > 60"
            dominant-baseline="middle"
            :text-anchor="n === 0 ? 'start' : 'middle'"
            v-bind:style="{ fontSize: placement[2] > 10 ? '10px' : '7.5px' }"
            :transform="'rotate(90,' + placement[0] + ',' + placement[1] + ')'"
            :x="placement[0]"
            :y="placement[1]"
          >
            {{ country.label }}
          </text>
        </g>
      </g>
      <g
        v-for="(line, n) in categoryPlacement"
        class="categoryPlacements">
        <text
          class="category"
          :x="line.center"
          text-anchor="middle"
          :y="line.ys[1]">
          {{ line.label }}
        </text>
        <line
          class="categories"
          :x1="line.xs[0]"
          :x2="line.xs[1]"
          :y1="line.ys[0]"
          :y2="line.ys[0]" />
      </g>
    </svg>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import { ResizeObserver } from 'vue-resize'
  import Tooltip from '~/components/Tooltip.vue'
  import _ from 'lodash'

  export default {
    data: function () {
      return {
        resolution: [],
        shapes: [],
        shapi: [],
        points: [],
        placements: [],
        legendPlacements: [],
        categoryPlacement: [],
        rows: 5,
        gutter: 7
      }
    },
    computed: {
      ...mapState([
        'activeStatus',
        'activeColour',
        'groups',
        'activeTab',
        'scoresLabels',
        'colorRangesDegrees',
        'hoverCountry',
        'activeCountry'
      ]),
      ...mapGetters([
        'countries',
        'status',
        'organisations',
        'domains',
        'scores'
      ]),
      gutters () {
        const { rows, gutter } = this
        return (rows - 1) * gutter
      },
      row () {
        const { rows, gutters } = this
        return (100 - gutters) / (rows - 0.8)
      },
      footer () {
        const { row, gutters } = this
        return 100 - gutters - row * 4
      },
      ysPercent (state) {
        const { rows, gutter, row, footer } = this

        let i = 0
        return _.map(new Array(rows * 2), (_, n) => {
          if (n === 0) return 0
          if (n === 9) return 1
          if (n === 1) {
            i += footer
          } else {
            if (n % 2) {
              i += row
            } else {
              i += gutter
            }
          }
          return i / 100
        })
      }
    },
    watch: {
      points: function () {
        this.calcShapes()
        this.calcTextPlacement()
      }
    },
    methods: {
      ...mapActions([
        'makeActiveStatus',
        'makeActiveColour',
        'makeActiveTab',
        'makeHoverCountry'
      ]),
      getResolution () {
        this.resolution = [this.$refs.vis.clientWidth, this.$refs.vis.clientHeight]
        this.calcShapes()
        this.calcPoints()
        this.calcLegendPlacement()
        this.calcCategoryPlacement()
      },
      handleResize () {
        this.getResolution()
      },
      calcLegendPlacement () {
        let labels = ['Scaled by', '▲ Population', '▲ Land Mass', '▲ Economy']
        let [width, height] = this.resolution
        let { gutter, row } = this
        this.legendPlacements = _.map(labels, (label, n) => {
          return {
            'label': label,
            'x': width * 0.03 / 2,
            'y': height * (((n + 0.5) * row + n * gutter) / 100)
          }
        })
      },
      calcPoints () {
        let [width, height] = this.resolution
        let { rows } = this
        let cumulation = _.fill(new Array(rows), 0)

        let ys = _.map(this.ysPercent, y => {
          return height - height * y
        })

        let prevXs = _.fill(new Array(rows * 2), 0)

        let points = _.map(this.countries, country => {
          let points = []
          let leftsideXs = _.reverse(prevXs)

          _.each(leftsideXs, (x, n) => {
            points.push([x, ys[n]])
          })

          let { counter, population, gdp, area } = country['values']

          cumulation[0] += counter['percent']
          cumulation[1] += population['percent']
          cumulation[2] += area['percent']
          cumulation[3] += gdp['percent']
          cumulation[4] += counter['percent']

          let rightsideXs = _.map(new Array(rows * 2), (x, n) => {
            let index = Math.floor(n / 2)
            return _.round((cumulation[index] / 100) * (width * 0.97), 2)
          })

          _.each(rightsideXs, (x, n) => {
            points.push([x, ys[(rows * 2 - 1) - n]])
          })

          prevXs = rightsideXs
          return points
        })

        this.points = Object.freeze(points)
      },
      calcTextPlacement () {
        const placements = _.map(this.points, country => {
          let n = country.length / 4
          const points = _.clone(country)
          const placements = []
          while (n--) {
            const corners = _.flatten([_.pullAt(points, [0, 1]), _.pullAt(points, [points.length - 2, points.length - 1])])
            const xs = _.map(corners, '0')
            const ys = _.map(corners, '1')
            const minx = _.min(xs)
            const maxx = _.max(xs)
            const miny = _.min(ys)
            const maxy = _.max(ys)
            const x = _.round((maxx - minx) / 2 + minx, 1)
            const y = _.round((maxy - miny) / (n === 0 ? 6 : 2) + miny, 1)
            placements[n] = [x, y, maxx - minx, maxy - miny]
          }
          return placements
        })

        this.placements = Object.freeze(placements)
      },
      calcCategoryPlacement () {
        const height = this.resolution[1]
        const y1 = (this.row / 100 / 8 * 7) * height
        const y2 = y1 - 5
        const ys = [y1, y2]

        // Move to store
        const ranges = _.fromPairs(_.map(_.groupBy(this.countries, 'scores.regimeType'), (list, key) => {
          return [key, _.map(_.pullAt(list, [0, list.length - 1]), 'scores.rank')]
        }))
        // Move to store end

        const places = _.map(ranges, (range, key) => {
          const coords = _.map(range, n => {
            return this.points[n - 1][0][0] + (this.points[n - 1][10][0] - this.points[n - 1][0][0]) / 2
          })
          return {
            'label': key,
            'xs': coords,
            'ys': ys,
            'center': coords[0] + (coords[1] - coords[0]) / 2
          }
        })
        this.categoryPlacement = places
      },
      calcShapes () {
        let shapes = _.map(this.points, country => {
          let curves = []

          let l = country.length - 1
          for (let n = 0; n < l; n++) {
            if (n % 2) {
              let diff = (country[n + 1][1] - country[n][1]) / 3
              let y1 = country[n][1] + diff * 2
              let y2 = country[n + 1][1] - diff * 2
              curves.push('C ' + [country[n][0], y1].join(' ') + ' , ' + [country[n + 1][0], y2].join(' ') + ' , ')
            } else {
              curves.push(country[n].join(' ') + ' L ' + country[n + 1].join(' '))
            }
          }

          return 'M ' + curves.join(' ') + ' Z'
        })

        this.shapes = Object.freeze(shapes)
      },
      checkActive (activeCountry, country) {
        if (!activeCountry.length) return false
        return _.get(country, activeCountry[0]) === activeCountry[1]
      }
    },
    components: {
      'resize-observer': ResizeObserver,
      Tooltip
    },
    mounted () {
      this.getResolution()
    }
  }
</script>

<style lang="scss">
  .wrapper {
    position: relative;
  }
</style>
