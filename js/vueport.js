var start = "https://api.stackexchange.com/2.2/";
var order = "?order=desc&sort=activity";
var search = "search?order=desc&sort=activity"
var tag = "&tagged=";
var intitle = "&intitle=";
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
    results: {
      items: []
    },
    hasResults: "",
    error: [],
    showHide: "Show",
    answers: [],
    answerBodies: [],
    seen: false,
    currentQuestionId: 0
  },
  methods: {

    getDataByIntitle: function() {
      var vm = this;
      url = start + search + intitle + vm.message + end;
      vm.resetProps();

      this.$http
        .get(url)
        .then(function(response) {
            vm.results = response.data;
            vm.results.items.showAnswers = false;
            if(vm.results.items.length == 0) {
              vm.hasResults = false;
            }
            else {
              vm.hasResults = true;
            }
          })
          .catch(function(error){
            vm.error = error.response.data;
          });
        },

    getDataByTag: function(t) {
      var vm = this;
      url = start + search + tag + t + end;
      vm.resetProps();

      this.$http
        .get(url)
        .then(function(response) {
            vm.results = response.data;
            vm.results.items.showAnswers = false;
            if(vm.results.items.length == 0) {
              vm.hasResults = false;
            }
            else {
              vm.hasResults = true;
            }
          })
        .catch(function(error){
            vm.error = error.response.data;
          });
      },

    getAnswers: function(id) {
      var vm = this;
      vm.currentQuestionId = id;
      vm.answerBodies = [];

      var temp;
      url = start + "questions/" + id + "/answers" + order + end;

      this.$http
        .get(url)
        .then(function(response) {
          vm.answers = response.data.items;
          for(var i = 0; i < vm.answers.length; i++) {
            vm.getAnswer(response.data.items[i].answer_id);
          }
        });
    },

    getAnswer: function(id) {
      var vm = this;
      var temp;
      url = start + "answers/" + id + order + filter + end;
      this.$http
        .get(url)
        .then(function(response) {
          temp = response.data.items;
          vm.answerBodies.push(temp);
          vm.answerBodies = vm.answerBodies.concat.apply([], vm.answerBodies);
        })
        .catch(function(error){
          vm.error = error.response.data;
        });
      vm.seen = true;
    },

    buttonHandler: function(s, aId) {
      var vm = this;
      if(!s) {
        vm.seen = true;
        vm.getAnswers(aId);
        vm.showHide = "Hide";
      }
      if(s) {
        vm.seen = false;
      }
    },

    clickedTag: function(t) {
      var vm = this;
      vm.message = t;
      vm.getDataByTag(t);
    },

    answerHandler: function(ansId, qId) {
      var vm = this;
      var idIsTrue = true;

      for(var i = 0; i < vm.answerBodies.length; i++) {
        if(ansId !== qId) {
          idIsTrue = false;
        }
      }
      if(vm.showHide && idIsTrue) {
        return true;
      }
    },

    resetProps: function() {
      var vm = this;

      vm.error = [];
      vm.error = [];
      vm.answers = [];
      vm.answerBodies = [];
      vm.seen = false;
      vm.currentQuestionId = "";
    }

  }

});
