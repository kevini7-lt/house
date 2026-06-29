function clone(value) {
  if (value === undefined || value === null) {
    return value
  }

  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    console.warn('数据克隆失败，返回原始数据', error)
    return value
  }
}

module.exports = clone
