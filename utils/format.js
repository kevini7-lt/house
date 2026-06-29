// 格式化工具统一收口，避免页面里出现大量重复字符串拼接。
function formatRent(rent) {
  return `￥${rent}/月`;
}

function formatPhone(phone) {
  if (!phone) {
    return '-';
  }
  return String(phone);
}

function formatStatus(status) {
  if (!status) {
    return '-';
  }
  return status;
}

module.exports = {
  formatRent,
  formatPhone,
  formatStatus
};
