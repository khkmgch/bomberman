import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

//Sceneを拡張
declare global {
  namespace Phaser {
    interface Scene {
      rexUI: UIPlugin;
    }
  }
}
