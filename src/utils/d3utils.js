/* eslint-disable */
import * as d3 from 'd3'

export const
  drawRadicalDendrogram = (svg, data, vuetify) => {
    const refWidth = 1080
    let width = window.innerWidth
    let height = window.innerHeight
    let windowWidth = 0
    if (width > height) {
      windowWidth = height * 0.8
      width = height * 0.8
      height = width
    } else {
      windowWidth = width
      height = width * 1.2
      width = width * 0.95
    }

    const strokeColor = vuetify.theme.dark ? 'black': 'white'
    const fontColor = vuetify.theme.dark ? 'white': 'black'
    console.log(strokeColor)
    const radius = width / 2 + refWidth / width * 15
    const tree = d3.cluster().size([2 * Math.PI, radius - 100])
    const root = tree(
      d3
        .hierarchy(data)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name))
    )
    svg.selectAll("*").remove()
    svg
      .attr('width', width)
      .attr('height', height)
    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5 * width / refWidth )
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr(
        'd',
        d3
          .linkRadial()
          .angle((d) => d.x)
          .radius((d) => d.y)

      )
    svg
      .append('g')
      .selectAll('circle')
      .data(root.descendants())
      .join('circle')
      .attr(
        'transform',
        (d) => `
    rotate(${(d.x * 180) / Math.PI - 90})
    translate(${d.y},0)
  `
      )
      .attr('fill', (d) => (d.children ? '#555' : '#999'))
      .attr('r', 2.5 * width / refWidth)
    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12 * width / refWidth)
      .attr('fill', fontColor)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3 * width / refWidth)
      .selectAll('text')
      .data(root.descendants())
      .join('text')
      .attr(
        'transform',
        (d) => `
    rotate(${(d.x * 180) / Math.PI - 90}) 
    translate(${d.y},0) 
    rotate(${d.x >= Math.PI ? 180 : 0})
  `
      )
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.x < Math.PI === !d.children ? 6 : -6))
      .attr('text-anchor', (d) =>
        d.x < Math.PI === !d.children ? 'start' : 'end'
      )
      .text((d) => d.data.name)
      .clone(true)
      .lower()
      .attr('stroke', strokeColor)

    svg.attr('viewBox', [-windowWidth/2, -height/2, width, height])
  }

export const drawClearTree = (svg, data) => {
  const width = window.innerWidth * 0.4
  const tree = (data) => {
    const root = d3.hierarchy(data)
    root.dx = 20
    root.dy = width / (root.height + 1)
    return d3.tree().nodeSize([root.dx, root.dy])(root)
  }

  const root = tree(data)

  let x0 = Infinity
  let x1 = -x0
  root.each((d) => {
    if (d.x > x1) x1 = d.x
    if (d.x < x0) x0 = d.x
  })

  svg.attr('viewBox', [0, 0, width, x1 - x0 + root.dx * 2])

  const g = svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('transform', `translate(${root.dy / 3},${root.dx - x0})`)

  const link = g
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr(
      'd',
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
    )

  const node = g
    .append('g')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)

  node
    .append('circle')
    .attr('fill', (d) => (d.children ? '#555' : '#999'))
    .attr('r', 2.5)

  node
    .append('text')
    .attr('dy', '0.31em')
    .attr('x', (d) => (d.children ? -6 : 6))
    .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr('stroke', 'white')
}

export const buildHierarchyData = (datas) => {
  const domainMap = {}
  datas.forEach((depend) => {
    if (depend.ancestor.id in domainMap) {
      const domainNode = domainMap[depend.ancestor.id]
      if (depend.descendant.id in domainMap) {
        domainNode.children.push(domainMap[depend.descendant.id])
      } else {
        const d = {
          name: depend.descendant.title,
          id: depend.descendant.id,
          children: []
        }
        domainMap[depend.descendant.id] = d
        domainNode.children.push(d)
      }
    } else {
      const a = {
        name: depend.ancestor.title,
        id: depend.ancestor.id,
        children: []
      }
      domainMap[depend.ancestor.id] = a
      if (depend.descendant.id in domainMap) {
        domainMap[depend.ancestor.id].children.push(
          domainMap[depend.descendant.id]
        )
      } else {
        const d = {
          name: depend.descendant.title,
          id: depend.descendant.id,
          children: []
        }
        domainMap[depend.descendant.id] = d
        a.children.push(d)
      }
    }
  })
  return domainMap
}