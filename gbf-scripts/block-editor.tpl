<?php 

function #component#_editor_scripts() {
    $editorStylePath = '#editorStylePath#';

    wp_enqueue_style(
      '#component#-blocks-editor-css',
      plugins_url($editorStylePath, __FILE__),
      [  'wp-blocks', 'wp-element', 'wp-components', 'wp-i18n' ],
      filemtime( plugin_dir_path( __FILE__ ) . $editorStylePath )
    );
}

// Hook scripts function into block editor hook
add_action( 'enqueue_block_editor_assets', '#component#_editor_scripts' );