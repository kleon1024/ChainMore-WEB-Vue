export const searchQuery = (val: string, items: any[], compare) => {
  const qs = val.split(' ')
  if (val === '' || qs.length === 0) {
    return items
  }
  const d = {}
  const temp: any[] = []
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i]
    for (let j = 0; j < items.length; j++) {
      const r = items[j]
      if (compare(r, q)) {
        if (r.id in d) {
          d[r.id].count += 1
        } else {
          r.count = 1
          d[r.id] = r
          temp.push(r)
        }
      }
    }
  }
  return temp.sort((a, b) => b.count - a.count)
}
