var Store = require('react-native-store');

class Db {
  constructor() {
    this.user = Store.model('user');
    this.college = Store.model('college');

    this.college.find({
      where: {
        ver: {gte: ver}
      }
    }).then(result => {
      if(!result)this.load();
    });
  }

  async load() { // Load college statistics into the app database
    await this.college.remove({});
    await this.college.add({ver: ver});
    for(var id in data){
      await this.college.add(data[id]);
    }
  }

  async setUser(user, passwd, profile) {
    await this.user.remove({});
    await this.user.add({user: user, passwd: passwd, profile: profile});
  }

  getUser() { // myDb.getUser().then(result => { ... });
    return this.user.find({});
  }

  eraseUser() {
    return this.user.remove({});
  }

  filter(data) { // myDb.filter([6, 11, 21]).then(result => { ... });
    var geo = [], comp = [], size = [];

    for(var id in data){
      if(parseInt(data[id] / 10) == 0)geo.push({geo: data[id] % 10});
      else if(parseInt(data[id] / 10) == 1)comp.push({comp: data[id] % 10});
      else if(parseInt(data[id] / 10) == 2)size.push({size: data[id] % 10});
    }

    return this.college.find({
      fields: {id: true, cname: true},
      where: {
        and: [
          {or: geo},
          {or: comp},
          {or: size}
        ]
      }
    });
  }
}

module.exports = Db;

var ver = 6;
var data = [
  {
    "id": 177,
    "type": "私立",
    "geo": 2,
    "comp": 1,
    "size": 3,
    "name": "Univ. of Chicago",
    "cname": "芝大",
    "type2": "综合",
    "city": "Chicago IL",
    "setting": "都市"
  },
  {
    "id": 205,
    "type": "私立",
    "geo": 3,
    "comp": 3,
    "size": 2,
    "name": "Wake Forest Univ.",
    "cname": "维克森林",
    "type2": "综合",
    "city": "Winston-Salem NC",
    "setting": "市郊"
  },
  {
    "id": 232,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 3,
    "name": "Univ. of Pennsylvania",
    "cname": "宾大",
    "type2": "综合",
    "city": "Philadelphia PA",
    "setting": "都市"
  },
  {
    "id": 241,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Illinois UC",
    "cname": "伊利诺伊香槟",
    "type2": "综合",
    "city": "Champaign IL",
    "setting": "城镇"
  },
  {
    "id": 925,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 3,
    "name": "Carnegie Mellon Univ.",
    "cname": "卡耐基梅隆",
    "type2": "综合",
    "city": "Pittsburgh PA",
    "setting": "都市"
  },
  {
    "id": 928,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 4,
    "name": "Columbia Univ.",
    "cname": "哥大",
    "type2": "综合",
    "city": "New York NY",
    "setting": "都市"
  },
  {
    "id": 930,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 3,
    "name": "Cornell Univ.",
    "cname": "康奈尔",
    "type2": "综合",
    "city": "Ithaca NY",
    "setting": "乡村"
  },
  {
    "id": 933,
    "type": "私立",
    "geo": 3,
    "comp": 3,
    "size": 3,
    "name": "Emory Univ.",
    "cname": "埃默里",
    "type2": "综合",
    "city": "Atlanta GA",
    "setting": "城镇"
  },
  {
    "id": 937,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 3,
    "name": "Harvard Univ.",
    "cname": "哈佛",
    "type2": "综合",
    "city": "Cambridge MA",
    "setting": "都市"
  },
  {
    "id": 943,
    "type": "公立",
    "geo": 2,
    "comp": 3,
    "size": 4,
    "name": "Univ. of Michigan",
    "cname": "密歇根",
    "type2": "综合",
    "city": "Ann Arbor MI",
    "setting": "城镇"
  },
  {
    "id": 945,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 4,
    "name": "New York Univ.",
    "cname": "纽大",
    "type2": "综合",
    "city": "New York NY",
    "setting": "都市"
  },
  {
    "id": 947,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 2,
    "name": "Univ. of Rochester",
    "cname": "罗彻斯特",
    "type2": "综合",
    "city": "Rochester NY",
    "setting": "市郊"
  },
  {
    "id": 952,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Wisconsin Madison",
    "cname": "威斯康星",
    "type2": "综合",
    "city": "Madison WI",
    "setting": "城镇"
  },
  {
    "id": 1131,
    "type": "公立",
    "geo": 3,
    "comp": 3,
    "size": 3,
    "name": "Georgia Institute of Tech.",
    "cname": "佐治亚理工",
    "type2": "综合",
    "city": "Atlanta GA",
    "setting": "都市"
  },
  {
    "id": 1387,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 2,
    "name": "Princeton Univ.",
    "cname": "普林斯顿",
    "type2": "综合",
    "city": "Princeton NJ",
    "setting": "市郊"
  },
  {
    "id": 1391,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 3,
    "name": "Yale Univ.",
    "cname": "耶鲁",
    "type2": "综合",
    "city": "New Haven CT",
    "setting": "城镇"
  },
  {
    "id": 1397,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 3,
    "name": "Mass. Institute of Tech.",
    "cname": "麻省理工",
    "type2": "综合",
    "city": "Cambridge MA",
    "setting": "都市"
  },
  {
    "id": 1399,
    "type": "私立",
    "geo": 6,
    "comp": 1,
    "size": 3,
    "name": "Stanford Univ.",
    "cname": "斯坦福",
    "type2": "综合",
    "city": "Stanford CA",
    "setting": "市郊"
  },
  {
    "id": 1404,
    "type": "私立",
    "geo": 3,
    "comp": 2,
    "size": 3,
    "name": "Duke Univ.",
    "cname": "杜克",
    "type2": "综合",
    "city": "Durham NC",
    "setting": "市郊"
  },
  {
    "id": 1407,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 2,
    "name": "Dartmouth Coll.",
    "cname": "达特茅斯",
    "type2": "综合",
    "city": "Hanover NH",
    "setting": "乡村"
  },
  {
    "id": 1554,
    "type": "私立",
    "geo": 6,
    "comp": 1,
    "size": 1,
    "name": "California Institute of Tech.",
    "cname": "加州理工",
    "type2": "综合",
    "city": "Pasadena CA",
    "setting": "市郊"
  },
  {
    "id": 1557,
    "type": "私立",
    "geo": 2,
    "comp": 2,
    "size": 3,
    "name": "Northwestern Univ.",
    "cname": "西北",
    "type2": "综合",
    "city": "Evanston IL",
    "setting": "市郊"
  },
  {
    "id": 1560,
    "type": "私立",
    "geo": 1,
    "comp": 1,
    "size": 2,
    "name": "Brown Univ.",
    "cname": "布朗",
    "type2": "综合",
    "city": "Providence RI",
    "setting": "城镇"
  },
  {
    "id": 1563,
    "type": "私立",
    "geo": 3,
    "comp": 2,
    "size": 3,
    "name": "Vanderbilt Univ.",
    "cname": "范德堡",
    "type2": "综合",
    "city": "Nashville TN",
    "setting": "都市"
  },
  {
    "id": 1574,
    "type": "私立",
    "geo": 3,
    "comp": 2,
    "size": 2,
    "name": "Rice Univ.",
    "cname": "莱斯",
    "type2": "综合",
    "city": "Houston TX",
    "setting": "都市"
  },
  {
    "id": 1576,
    "type": "私立",
    "geo": 2,
    "comp": 2,
    "size": 3,
    "name": "Univ. of Notre Dame",
    "cname": "圣母",
    "type2": "综合",
    "city": "Notre Dame IN",
    "setting": "城镇"
  },
  {
    "id": 1593,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 3,
    "name": "Georgetown Univ.",
    "cname": "乔治城",
    "type2": "综合",
    "city": "Washington DC",
    "setting": "都市"
  },
  {
    "id": 1606,
    "type": "公立",
    "geo": 1,
    "comp": 3,
    "size": 3,
    "name": "Univ. of Virginia",
    "cname": "弗吉尼亚大学",
    "type2": "综合",
    "city": "Charlottesville VA",
    "setting": "市郊"
  },
  {
    "id": 1610,
    "type": "私立",
    "geo": 6,
    "comp": 2,
    "size": 4,
    "name": "Univ. of Southern California",
    "cname": "南加大",
    "type2": "综合",
    "city": "Los Angeles CA",
    "setting": "都市"
  },
  {
    "id": 1612,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 3,
    "name": "Tufts Univ.",
    "cname": "塔夫茨",
    "type2": "综合",
    "city": "Medford MA",
    "setting": "市郊"
  },
  {
    "id": 1617,
    "type": "公立",
    "geo": 3,
    "comp": 3,
    "size": 4,
    "name": "Univ. of North Carolina CH",
    "cname": "北卡教堂山",
    "type2": "综合",
    "city": "Chapel Hill NC",
    "setting": "市郊"
  },
  {
    "id": 1641,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 3,
    "name": "Boston Coll.",
    "cname": "波士顿学院",
    "type2": "综合",
    "city": "Chestnut Hill MA",
    "setting": "市郊"
  },
  {
    "id": 1647,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 2,
    "name": "Brandeis Univ.",
    "cname": "布兰戴斯",
    "type2": "综合",
    "city": "Waltham MA",
    "setting": "市郊"
  },
  {
    "id": 1651,
    "type": "公立",
    "geo": 1,
    "comp": 3,
    "size": 2,
    "name": "Coll. of William & Mary",
    "cname": "威廉玛丽",
    "type2": "综合",
    "city": "Williamsburg VA",
    "setting": "市郊"
  },
  {
    "id": 1714,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 2,
    "name": "Lehigh Univ.",
    "cname": "利哈伊",
    "type2": "综合",
    "city": "Bethlehem PA",
    "setting": "城镇"
  },
  {
    "id": 1718,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Pennsylvania State Univ.",
    "cname": "宾州州立",
    "type2": "综合",
    "city": "University Park PA",
    "setting": "城镇"
  },
  {
    "id": 1724,
    "type": "公立",
    "geo": 3,
    "comp": 3,
    "size": 4,
    "name": "Univ. of Texas Austin",
    "cname": "德州奥斯汀",
    "type2": "综合",
    "city": "Austin TX",
    "setting": "都市"
  },
  {
    "id": 1733,
    "type": "公立",
    "geo": 5,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Washington",
    "cname": "华大西雅图",
    "type2": "综合",
    "city": "Seattle WA",
    "setting": "都市"
  },
  {
    "id": 1737,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 4,
    "name": "Boston Univ.",
    "cname": "波士顿大学",
    "type2": "综合",
    "city": "Boston MA",
    "setting": "都市"
  },
  {
    "id": 1739,
    "type": "私立",
    "geo": 3,
    "comp": 3,
    "size": 3,
    "name": "Tulane Univ.",
    "cname": "杜兰",
    "type2": "综合",
    "city": "New Orleans LA",
    "setting": "都市"
  },
  {
    "id": 1745,
    "type": "公立",
    "geo": 3,
    "comp": 3,
    "size": 4,
    "name": "Univ. of Florida",
    "cname": "佛罗里达",
    "type2": "综合",
    "city": "Gainesville FL",
    "setting": "市郊"
  },
  {
    "id": 1750,
    "type": "私立",
    "geo": 6,
    "comp": 3,
    "size": 2,
    "name": "Pepperdine Univ.",
    "cname": "佩珀代因",
    "type2": "综合",
    "city": "Malibu CA",
    "setting": "市郊"
  },
  {
    "id": 1756,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Maryland CP",
    "cname": "马里兰",
    "type2": "综合",
    "city": "College Park MD",
    "setting": "市郊"
  },
  {
    "id": 1760,
    "type": "私立",
    "geo": 3,
    "comp": 4,
    "size": 3,
    "name": "Southern Methodist Univ.",
    "cname": "南方卫理公会",
    "type2": "综合",
    "city": "Dallas TX",
    "setting": "都市"
  },
  {
    "id": 1762,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Pittsburgh",
    "cname": "匹兹堡",
    "type2": "综合",
    "city": "Pittsburgh PA",
    "setting": "都市"
  },
  {
    "id": 1768,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 4,
    "name": "George Washington Univ.",
    "cname": "乔治华盛顿",
    "type2": "综合",
    "city": "Washington DC",
    "setting": "都市"
  },
  {
    "id": 1770,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 3,
    "name": "Syracuse Univ.",
    "cname": "雪城",
    "type2": "综合",
    "city": "Syracuse NY",
    "setting": "城镇"
  },
  {
    "id": 1789,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Williams Coll.",
    "cname": "威廉姆斯",
    "type2": "文理",
    "city": "Williamstown MA",
    "setting": "乡村"
  },
  {
    "id": 1791,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Amherst Coll.",
    "cname": "阿默斯特",
    "type2": "文理",
    "city": "Amherst MA",
    "setting": "乡村"
  },
  {
    "id": 1796,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Swarthmore Coll.",
    "cname": "斯沃斯莫尔",
    "type2": "文理",
    "city": "Swarthmore PA",
    "setting": "市郊"
  },
  {
    "id": 1801,
    "type": "私立",
    "geo": 6,
    "comp": 2,
    "size": 1,
    "name": "Pomona Coll.",
    "cname": "波莫纳",
    "type2": "文理",
    "city": "Claremont CA",
    "setting": "市郊"
  },
  {
    "id": 1806,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Middlebury Coll.",
    "cname": "明德",
    "type2": "文理",
    "city": "Middlebury VT",
    "setting": "乡村"
  },
  {
    "id": 1977,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Bowdoin Coll.",
    "cname": "鲍登",
    "type2": "文理",
    "city": "Brunswick ME",
    "setting": "市郊"
  },
  {
    "id": 1981,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Wellesley Coll.",
    "cname": "威尔斯利",
    "type2": "文理",
    "city": "Wellesley MA",
    "setting": "市郊"
  },
  {
    "id": 1985,
    "type": "私立",
    "geo": 2,
    "comp": 3,
    "size": 1,
    "name": "Carleton Coll.",
    "cname": "卡尔顿",
    "type2": "文理",
    "city": "Northfield MN",
    "setting": "乡村"
  },
  {
    "id": 1988,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Haverford Coll.",
    "cname": "哈弗福德",
    "type2": "文理",
    "city": "Haverford PA",
    "setting": "市郊"
  },
  {
    "id": 2110,
    "type": "私立",
    "geo": 6,
    "comp": 2,
    "size": 1,
    "name": "Claremont McKenna Coll.",
    "cname": "克莱蒙特",
    "type2": "文理",
    "city": "Claremont CA",
    "setting": "市郊"
  },
  {
    "id": 2112,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Vassar Coll.",
    "cname": "瓦萨",
    "type2": "文理",
    "city": "Poughkeepsie NY",
    "setting": "市郊"
  },
  {
    "id": 2116,
    "type": "私立",
    "geo": 3,
    "comp": 2,
    "size": 1,
    "name": "Davidson Coll.",
    "cname": "戴维森",
    "type2": "文理",
    "city": "Davidson NC",
    "setting": "市郊"
  },
  {
    "id": 2118,
    "type": "私立",
    "geo": 6,
    "comp": 2,
    "size": 1,
    "name": "Harvey Mudd Coll.",
    "cname": "哈维姆德",
    "type2": "文理",
    "city": "Claremont CA",
    "setting": "市郊"
  },
  {
    "id": 2126,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Washington & Lee Univ.",
    "cname": "华盛顿与李",
    "type2": "文理",
    "city": "Lexington VA",
    "setting": "乡村"
  },
  {
    "id": 2130,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Hamilton Coll.",
    "cname": "汉密尔顿",
    "type2": "文理",
    "city": "Clinton NY",
    "setting": "乡村"
  },
  {
    "id": 2132,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Wesleyan Univ.",
    "cname": "卫斯理安",
    "type2": "文理",
    "city": "Middletown CT",
    "setting": "都市"
  },
  {
    "id": 2192,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Colby Coll.",
    "cname": "科尔比",
    "type2": "文理",
    "city": "Waterville ME",
    "setting": "乡村"
  },
  {
    "id": 2194,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Colgate Univ.",
    "cname": "科尔盖特",
    "type2": "文理",
    "city": "Hamilton NY",
    "setting": "乡村"
  },
  {
    "id": 2196,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 1,
    "name": "Smith Coll.",
    "cname": "史密斯",
    "type2": "文理",
    "city": "Northampton MA",
    "setting": "市郊"
  },
  {
    "id": 2198,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Bates Coll.",
    "cname": "贝茨",
    "type2": "文理",
    "city": "Lewiston ME",
    "setting": "城镇"
  },
  {
    "id": 2202,
    "type": "私立",
    "geo": 2,
    "comp": 3,
    "size": 1,
    "name": "Macalester Coll.",
    "cname": "马卡莱斯特",
    "type2": "文理",
    "city": "St. Paul MN",
    "setting": "都市"
  },
  {
    "id": 2206,
    "type": "私立",
    "geo": 6,
    "comp": 3,
    "size": 1,
    "name": "Scripps Coll.",
    "cname": "斯克利普斯",
    "type2": "文理",
    "city": "Claremont CA",
    "setting": "市郊"
  },
  {
    "id": 2227,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Bryn Mawr Coll.",
    "cname": "布林茅尔",
    "type2": "文理",
    "city": "Bryn Mawr PA",
    "setting": "市郊"
  },
  {
    "id": 2229,
    "type": "私立",
    "geo": 2,
    "comp": 3,
    "size": 1,
    "name": "Oberlin Coll.",
    "cname": "欧柏林",
    "type2": "文理",
    "city": "Oberlin OH",
    "setting": "市郊"
  },
  {
    "id": 2233,
    "type": "私立",
    "geo": 1,
    "comp": 2,
    "size": 1,
    "name": "Barnard Coll.",
    "cname": "巴纳德",
    "type2": "文理",
    "city": "New York NY",
    "setting": "都市"
  },
  {
    "id": 2238,
    "type": "私立",
    "geo": 4,
    "comp": 2,
    "size": 1,
    "name": "Colorado Coll.",
    "cname": "科罗拉多学院",
    "type2": "文理",
    "city": "Colorado Springs CO",
    "setting": "城镇"
  },
  {
    "id": 2240,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Univ. of Richmond",
    "cname": "里士满",
    "type2": "文理",
    "city": "Richmond VA",
    "setting": "市郊"
  },
  {
    "id": 2242,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Bucknell Univ.",
    "cname": "巴克内尔",
    "type2": "文理",
    "city": "Lewisburg PA",
    "setting": "乡村"
  },
  {
    "id": 2244,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 1,
    "name": "Mount Holyoke Coll.",
    "cname": "曼荷莲",
    "type2": "文理",
    "city": "South Hadley MA",
    "setting": "市郊"
  },
  {
    "id": 2246,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Coll. of the Holy Cross",
    "cname": "圣十字",
    "type2": "文理",
    "city": "Worcester MA",
    "setting": "市郊"
  },
  {
    "id": 2248,
    "type": "私立",
    "geo": 3,
    "comp": 4,
    "size": 1,
    "name": "Sewanee: Univ. of the South",
    "cname": "西沃恩",
    "type2": "文理",
    "city": "Sewanee TN",
    "setting": "乡村"
  },
  {
    "id": 3531,
    "type": "公立",
    "geo": 6,
    "comp": 2,
    "size": 4,
    "name": "Univ. of Calif. Berkeley",
    "cname": "加州伯克利",
    "type2": "综合",
    "city": "Berkeley CA",
    "setting": "城镇"
  },
  {
    "id": 3533,
    "type": "公立",
    "geo": 6,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Calif. Davis",
    "cname": "加州戴维斯",
    "type2": "综合",
    "city": "Davis CA",
    "setting": "城镇"
  },
  {
    "id": 3535,
    "type": "公立",
    "geo": 6,
    "comp": 3,
    "size": 4,
    "name": "Univ. of Calif. Irvine",
    "cname": "加州欧文",
    "type2": "综合",
    "city": "Irvine CA",
    "setting": "市郊"
  },
  {
    "id": 3537,
    "type": "公立",
    "geo": 6,
    "comp": 2,
    "size": 4,
    "name": "Univ. of Calif. Los Angeles",
    "cname": "加州洛杉矶",
    "type2": "综合",
    "city": "Los Angeles CA",
    "setting": "都市"
  },
  {
    "id": 3539,
    "type": "公立",
    "geo": 6,
    "comp": 4,
    "size": 2,
    "name": "Univ. of Calif. Merced",
    "cname": "加州默塞德",
    "type2": "综合",
    "city": "Merced?CA",
    "setting": "乡村"
  },
  {
    "id": 3541,
    "type": "公立",
    "geo": 6,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Calif. Riverside",
    "cname": "加州河滨",
    "type2": "综合",
    "city": "Riverside?CA",
    "setting": "城镇"
  },
  {
    "id": 3543,
    "type": "公立",
    "geo": 6,
    "comp": 3,
    "size": 4,
    "name": "Univ. of Calif. San Diego",
    "cname": "加州圣地亚哥",
    "type2": "综合",
    "city": "La Jolla CA",
    "setting": "都市"
  },
  {
    "id": 3547,
    "type": "公立",
    "geo": 6,
    "comp": 3,
    "size": 3,
    "name": "Univ. of Calif. Santa Barbara",
    "cname": "加州圣芭芭拉",
    "type2": "综合",
    "city": "Santa Barbara CA",
    "setting": "市郊"
  },
  {
    "id": 3549,
    "type": "公立",
    "geo": 6,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Calif. Santa Cruz",
    "cname": "加州圣克鲁兹",
    "type2": "综合",
    "city": "Santa Cruz CA",
    "setting": "市郊"
  },
  {
    "id": 3559,
    "type": "私立",
    "geo": 2,
    "comp": 4,
    "size": 2,
    "name": "Case Western Reserve Univ.",
    "cname": "凯斯西储",
    "type2": "综合",
    "city": "Cleveland OH",
    "setting": "都市"
  },
  {
    "id": 3561,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Connecticut",
    "cname": "康涅狄格大学",
    "type2": "综合",
    "city": "Storrs?CT",
    "setting": "乡村"
  },
  {
    "id": 3563,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 3,
    "name": "Fordham Univ.",
    "cname": "福特汉姆",
    "type2": "综合",
    "city": "New York?NY",
    "setting": "都市"
  },
  {
    "id": 3565,
    "type": "私立",
    "geo": 3,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Miami",
    "cname": "迈阿密大学",
    "type2": "综合",
    "city": "Coral Gables?FL",
    "setting": "市郊"
  },
  {
    "id": 3567,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 3,
    "name": "Northeastern Univ.",
    "cname": "东北",
    "type2": "综合",
    "city": "Boston?MA",
    "setting": "都市"
  },
  {
    "id": 3569,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Ohio State Univ.",
    "cname": "俄亥俄州立",
    "type2": "综合",
    "city": "Columbus OH",
    "setting": "都市"
  },
  {
    "id": 3571,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 2,
    "name": "Rensselaer Poly. Institute",
    "cname": "伦斯勒理工",
    "type2": "综合",
    "city": "Troy NY",
    "setting": "市郊"
  },
  {
    "id": 3573,
    "type": "私立",
    "geo": 2,
    "comp": 2,
    "size": 3,
    "name": "Washington Univ. St. Louis",
    "cname": "圣路易斯华大",
    "type2": "综合",
    "city": "St. Louis MO",
    "setting": "市郊"
  },
  {
    "id": 3575,
    "type": "私立",
    "geo": 2,
    "comp": 3,
    "size": 1,
    "name": "Grinnell Coll.",
    "cname": "格林内尔",
    "type2": "文理",
    "city": "Grinnell IA",
    "setting": "乡村"
  },
  {
    "id": 3577,
    "type": "私立",
    "geo": 2,
    "comp": 2,
    "size": 1,
    "name": "Kenyon Coll.",
    "cname": "肯尼恩",
    "type2": "文理",
    "city": "Gambier OH",
    "setting": "乡村"
  },
  {
    "id": 3580,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Bard Coll.",
    "cname": "巴德",
    "type2": "文理",
    "city": "Annandale-On-Hudson NY",
    "setting": "乡村"
  },
  {
    "id": 3582,
    "type": "私立",
    "geo": 1,
    "comp": 3,
    "size": 1,
    "name": "Trinity Coll.",
    "cname": "三一",
    "type2": "文理",
    "city": "Hartford CT",
    "setting": "都市"
  },
  {
    "id": 3634,
    "type": "公立",
    "geo": 3,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Georgia",
    "cname": "佐治亚大学",
    "type2": "综合",
    "city": "Athens GA",
    "setting": "城镇"
  },
  {
    "id": 3636,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Rutgers Univ.",
    "cname": "罗格斯",
    "type2": "综合",
    "city": "Newark NJ",
    "setting": "都市"
  },
  {
    "id": 3638,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Purdue Univ.",
    "cname": "普渡",
    "type2": "综合",
    "city": "West Lafayette IN",
    "setting": "城镇"
  },
  {
    "id": 3640,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Minnesota TC",
    "cname": "明尼苏达双城",
    "type2": "综合",
    "city": "Minneapolis MN",
    "setting": "都市"
  },
  {
    "id": 3642,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Michigan State Univ.",
    "cname": "密歇根州立",
    "type2": "综合",
    "city": "East Lansing MI",
    "setting": "市郊"
  },
  {
    "id": 3644,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Iowa",
    "cname": "爱荷华",
    "type2": "综合",
    "city": "Iowa City IA",
    "setting": "城镇"
  },
  {
    "id": 3646,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Indiana Univ. Bloomington",
    "cname": "印地安那",
    "type2": "综合",
    "city": "Bloomington IN",
    "setting": "城镇"
  },
  {
    "id": 3648,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 3,
    "name": "Miami Univ. Oxford",
    "cname": "牛津迈阿密",
    "type2": "综合",
    "city": "Oxford OH",
    "setting": "乡村"
  },
  {
    "id": 3650,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 3,
    "name": "Stony Brook Univ. SUNY",
    "cname": "石溪",
    "type2": "综合",
    "city": "Stony Brook NY",
    "setting": "市郊"
  },
  {
    "id": 3652,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 2,
    "name": "Worcester Poly. Institute",
    "cname": "伍斯特理工",
    "type2": "综合",
    "city": "Worcester MA",
    "setting": "城镇"
  },
  {
    "id": 3661,
    "type": "公立",
    "geo": 3,
    "comp": 4,
    "size": 4,
    "name": "Texas A&M Univ.",
    "cname": "德州农工",
    "type2": "综合",
    "city": "College Station TX",
    "setting": "城镇"
  },
  {
    "id": 3663,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Virginia Poly. Institute",
    "cname": "弗吉尼亚理工",
    "type2": "综合",
    "city": "Blacksburg VA",
    "setting": "乡村"
  },
  {
    "id": 3665,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 3,
    "name": "American Univ.",
    "cname": "美国大学",
    "type2": "综合",
    "city": "Washington DC",
    "setting": "市郊"
  },
  {
    "id": 3667,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Delaware",
    "cname": "特拉华",
    "type2": "综合",
    "city": "Newark DE",
    "setting": "市郊"
  },
  {
    "id": 3669,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Vermont",
    "cname": "佛蒙特",
    "type2": "综合",
    "city": "Burlington VT",
    "setting": "市郊"
  },
  {
    "id": 3671,
    "type": "私立",
    "geo": 3,
    "comp": 4,
    "size": 1,
    "name": "Univ. of Tulsa",
    "cname": "塔尔萨",
    "type2": "综合",
    "city": "Tulsa OK",
    "setting": "城镇"
  },
  {
    "id": 3673,
    "type": "公立",
    "geo": 4,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Colorado Boulder",
    "cname": "科罗拉多大学",
    "type2": "综合",
    "city": "Boulder CO",
    "setting": "城镇"
  },
  {
    "id": 3675,
    "type": "公立",
    "geo": 3,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Alabama",
    "cname": "阿拉巴马",
    "type2": "综合",
    "city": "Tuscaloosa AL",
    "setting": "市郊"
  },
  {
    "id": 3677,
    "type": "公立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Mass. Amherst",
    "cname": "马萨诸塞",
    "type2": "综合",
    "city": "Amherst MA",
    "setting": "市郊"
  },
  {
    "id": 3679,
    "type": "私立",
    "geo": 4,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Denver",
    "cname": "丹佛",
    "type2": "综合",
    "city": "Denver CO",
    "setting": "城镇"
  },
  {
    "id": 3681,
    "type": "私立",
    "geo": 1,
    "comp": 4,
    "size": 4,
    "name": "Drexel Univ.",
    "cname": "德雷塞尔",
    "type2": "综合",
    "city": "Philadelphia PA",
    "setting": "都市"
  },
  {
    "id": 3683,
    "type": "公立",
    "geo": 2,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Kansas",
    "cname": "堪萨斯",
    "type2": "综合",
    "city": "Lawrence KS",
    "setting": "城镇"
  },
  {
    "id": 3685,
    "type": "公立",
    "geo": 3,
    "comp": 4,
    "size": 4,
    "name": "North Carolina State Univ.",
    "cname": "北卡州立",
    "type2": "综合",
    "city": "Raleigh NC",
    "setting": "城镇"
  },
  {
    "id": 3687,
    "type": "公立",
    "geo": 5,
    "comp": 4,
    "size": 3,
    "name": "Univ. of Oregon",
    "cname": "俄勒冈",
    "type2": "综合",
    "city": "Eugene OR",
    "setting": "城镇"
  },
  {
    "id": 3689,
    "type": "公立",
    "geo": 3,
    "comp": 4,
    "size": 4,
    "name": "Univ. of Oklahoma",
    "cname": "俄克拉荷马",
    "type2": "综合",
    "city": "Norman OK",
    "setting": "城镇"
  }
];
