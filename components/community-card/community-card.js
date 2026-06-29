Component({
  properties: {
    community: {
      type: Object,
      value: null
    }
  },

  methods: {
    handleTap() {
      this.triggerEvent('tap', {
        community: this.data.community
      });
    }
  }
});
