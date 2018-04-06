var start = "https://api.stackexchange.com/2.2/";
var order = "?order=desc&sort=activity";
var search = "search?order=desc&sort=activity"
var tag = "&tagged=";
var intitle = "&intitle=";
var answer = "answers/";
var url = "";
var filter = "&filter=!b1MMEcD.mWz_cH";
var end = "&site=stackoverflow";

Vue.prototype.$http = axios;

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment.unix(value).format('MM/DD/YYYY @ hh:mm a');
  }
})

var app = new Vue({
  el: "#app",
  data: {
    message: "",
    results: {},
    iteration: 0,
    pages: 0,
    seen: false,
    showHide: "Show",
    answer: []
  },
  methods: {

    getDataByIntitle: function() {
      var vm = this;
      url = start + search + intitle + this.message + end;
      this.$http
        .get(url)
        .then(function(response) {
            vm.results = response.data;
            vm.iteration = response.data.items.length;
            vm.pages = response.data.items.length;
          });
        },

    getDataByTag: function(t) {
      var vm = this;
      url = start + search + tag + t + end;
      this.$http
        .get(url)
        .then(function(response) {
            vm.results = response.data;
            vm.iteration = response.data.items.length;
            vm.pages = response.data.items.length;
          });
      },

    getAnswer: function(id) {
      var vm = this;
      url = start + answer + id + order + filter + end;
      this.$http
        .get(url)
        .then(function(response) {
          vm.answer = response.data.items[0];
        });
      vm.seen = true;
    },

    buttonHandler: function(s, i) {
      var vm = this;
      if(!s) {
        vm.seen = true;
        vm.getAnswer(i);
        vm.showHide = "Hide";
      }
      if(s) {
        vm.seen = false;
        vm.showHide = "Show";
      }
    },

    clickedTag: function(t) {
      var vm = this;
      vm.message = t;
      vm.getDataByTag(t);
    },

    answerHandler(s, i) {
      var vm = this;
      var id = vm.answer.answer_id;
      if(s && i == id) {
        return true;
      }
    }

  }

});
