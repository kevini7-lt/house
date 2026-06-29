var bannerList = [
  {
    id: 'banner-001',
    title: '智慧租房管理系统',
    subtitle: '集中管理房源、楼栋与租住状态',
    color: '#1677ff'
  },
  {
    id: 'banner-002',
    title: '真实房东房源库',
    subtitle: '11 个小区，房间信息完整展示',
    color: '#16a34a'
  },
  {
    id: 'banner-003',
    title: '稳定版小程序 v2',
    subtitle: '内联数据、统一接口、启动不白屏',
    color: '#f97316'
  }
]

var communityList = [
  { id: 'c001', name: '滨江花园', district: '南山区', address: '南山区滨江路 18 号', cover: '', tags: ['近地铁', '江景', '生活便利'] },
  { id: 'c002', name: '阳光城', district: '福田区', address: '福田区景田北街 66 号', cover: '', tags: ['成熟商圈', '电梯房', '通勤方便'] },
  { id: 'c003', name: '星河雅苑', district: '宝安区', address: '宝安区新湖路 39 号', cover: '', tags: ['安静小区', '停车方便', '精装'] },
  { id: 'c004', name: '绿洲公寓', district: '龙华区', address: '龙华区民治大道 128 号', cover: '', tags: ['青年公寓', '民水民电', '拎包入住'] },
  { id: 'c005', name: '海悦湾', district: '盐田区', address: '盐田区海景二路 9 号', cover: '', tags: ['海景', '低密度', '物业好'] },
  { id: 'c006', name: '云锦华府', district: '罗湖区', address: '罗湖区翠竹路 88 号', cover: '', tags: ['老城中心', '交通便利', '配套齐全'] },
  { id: 'c007', name: '锦绣里', district: '龙岗区', address: '龙岗区龙平西路 21 号', cover: '', tags: ['新装修', '价格友好', '采光好'] },
  { id: 'c008', name: '金地名苑', district: '光明区', address: '光明区公明南环大道 45 号', cover: '', tags: ['园区通勤', '绿化高', '空间大'] },
  { id: 'c009', name: '梧桐山居', district: '罗湖区', address: '罗湖区梧桐山路 16 号', cover: '', tags: ['山景', '空气好', '安静'] },
  { id: 'c010', name: '蓝湾国际', district: '前海区', address: '前海合作区桂湾三路 6 号', cover: '', tags: ['品质社区', '商务通勤', '设施新'] },
  { id: 'c011', name: '中央公园里', district: '坪山区', address: '坪山区坪山大道 200 号', cover: '', tags: ['公园旁', '整洁', '适合家庭'] }
]

var buildingSeeds = {
  c001: ['1 栋', '2 栋', '江景楼'],
  c002: ['A 座', 'B 座', 'C 座', 'D 座'],
  c003: ['东座', '西座', '南座'],
  c004: ['青年楼', '悦居楼'],
  c005: ['海风楼', '听涛楼', '观澜楼'],
  c006: ['翠竹阁', '云锦阁', '文华阁', '嘉园楼'],
  c007: ['一单元', '二单元', '三单元'],
  c008: ['6 栋', '7 栋', '8 栋', '9 栋', '10 栋'],
  c009: ['山语楼', '清风楼'],
  c010: ['T1', 'T2', 'T3'],
  c011: ['1 号楼', '2 号楼', '3 号楼', '5 号楼']
}

var layouts = ['单间', '一房一厅', '两房一厅']
var tagPool = ['采光好', '带阳台', '独立卫浴', '可做饭', '近公交', '家电齐全', '南北通透', '安静']
var names = ['张先生', '李女士', '王先生', '陈女士', '刘先生', '赵女士']

function pad(num) {
  return String(num).length > 1 ? String(num) : '0' + num
}

function makeBuildings() {
  var list = []
  communityList.forEach(function (community, cIndex) {
    var seeds = buildingSeeds[community.id] || []
    seeds.forEach(function (name, bIndex) {
      list.push({
        id: 'b' + pad(cIndex + 1) + pad(bIndex + 1),
        communityId: community.id,
        name: name,
        address: community.address + ' ' + name,
        floorCount: 7 + ((cIndex + bIndex) % 18),
        elevator: (cIndex + bIndex) % 2 === 0
      })
    })
  })
  return list
}

var buildingList = makeBuildings()

function makeRooms() {
  var rooms = []
  buildingList.forEach(function (building, bIndex) {
    var community = communityList.find(function (item) {
      return item.id === building.communityId
    }) || {}
    var count = 3 + (bIndex % 4)
    for (var i = 1; i <= count; i += 1) {
      var roomIndex = rooms.length + 1
      var status = (roomIndex % 3 === 0 || roomIndex % 7 === 0) ? '已租' : '可入住'
      var floor = 2 + ((i + bIndex) % 18)
      var number = floor + '0' + i
      rooms.push({
        id: 'r' + pad(roomIndex),
        communityId: building.communityId,
        buildingId: building.id,
        communityName: community.name || '未知小区',
        buildingName: building.name || '未知楼栋',
        number: number,
        rent: 1800 + ((bIndex * 230 + i * 180) % 5200),
        status: status,
        layout: layouts[(bIndex + i) % layouts.length],
        images: [
          '房间图片-' + pad(roomIndex) + '-客厅',
          '房间图片-' + pad(roomIndex) + '-卧室'
        ],
        contactName: names[(bIndex + i) % names.length],
        phone: '138' + pad((1000 + bIndex * 37 + i * 11) % 10000) + pad((6000 + roomIndex * 13) % 10000),
        address: (community.address || '') + ' ' + (building.name || '') + ' ' + number + ' 室',
        tags: [
          tagPool[(roomIndex + 0) % tagPool.length],
          tagPool[(roomIndex + 2) % tagPool.length],
          tagPool[(roomIndex + 5) % tagPool.length]
        ]
      })
    }
  })
  return rooms
}

var roomList = makeRooms()

module.exports = {
  bannerList: bannerList,
  communityList: communityList,
  buildingList: buildingList,
  roomList: roomList
}
