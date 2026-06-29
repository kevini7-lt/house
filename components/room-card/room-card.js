const { formatRent } = require('../../utils/format');

Component({
  properties: {
    room: {
      type: Object,
      value: null
    }
  },

  data: {
    formatRent: formatRent
  },

  methods: {
    handleTap() {
      this.triggerEvent('tap', {
        room: this.data.room
      });
    }
  }
});
