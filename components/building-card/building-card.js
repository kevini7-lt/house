Component({
  properties: {
    building: {
      type: Object,
      value: null
    }
  },

  methods: {
    handleTap() {
      this.triggerEvent('tap', {
        building: this.data.building
      });
    }
  }
});
