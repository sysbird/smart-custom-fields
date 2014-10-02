/**
 * settings.js
 * Version    : 1.0.0
 * Author     : Takashi Kitajima
 * Created    : September 23, 2014
 * Modified   :
 * License    : GPLv2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
jQuery( function( $ ) {
	$( '.smart-cf-fields-wrapper' ).each( function( i, e ) {
		var wrapper = $( e );
		var btn_add_group    = wrapper.find( '.btn-add-group' );
		var btn_remove_group = wrapper.find( '.btn-remove-group b' );
		var btn_add_field    = wrapper.find( '.btn-add-field' );
		var btn_remove_field = wrapper.find( '.btn-remove-field b' );
		var group_class      = '.smart-cf-group';
		var field_class      = '.smart-cf-field';
		var duplicate_alert_class = '.smart-cf-duplicate-alert';
		var cnt = wrapper.find( field_class ).length;

		/**
		 * 重複エラーメッセージ表示 & 重複時の更新不可
		 */
		wrapper.find( 'input[class="smart-cf-group-name"], input[class="smart-cf-field-name"]' ).keyup( function() {
			var val = $( this ).val();
			var cnt = 0;
			wrapper.find( 'input[class="smart-cf-group-name"], input[class="smart-cf-field-name"]' ).each( function( i, e ) {
				if ( val === $( this ).val() && val !== '' ) {
					cnt ++;
				}
			} );
			if ( cnt > 1 ) {
				if ( $( this ).siblings( duplicate_alert_class ).length < 1 ) {
					$( this ).after(
						$( '<div class="smart-cf-alert" />' )
							.addClass( duplicate_alert_class.replace( '.', '' ) )
							.text( smart_cf_settings.duplicate_alert )
					);
				}
				cnt = 0;
			} else {
				$( this ).siblings( duplicate_alert_class ).remove();
			}

			if ( $( duplicate_alert_class ).length ) {
				$( '#publish' ).attr( 'disabled', 'disabled' );
			} else {
				$( '#publish' ).removeAttr( 'disabled' );
			}
		} );

		/**
		 * sortable
		 */
		$( '.smart-cf-groups' ).sortable( {
			cursor: 'move',
			handle: '.smart-cf-group-repeat'
		} );
		$( '.smart-cf-fields' ).sortable( {
			cursor: 'move',
			handle: '.btn-remove-field'
		} );

		/**
		 * フィールドの開閉
		 */
		$( '.btn-remove-field' ).click( function() {
			var btn_remove_field_slide = $( this );
			var table = $( this ).parents( field_class ).find( 'table' );
			if ( table.hasClass( 'hide' ) ) {
				btn_remove_field_slide.find( 'span' ).text( '' );
				table.fadeIn( 'fast', function() {
					$( this ).removeClass( 'hide' );
				} );
			} else {
				var label = table.find( '.smart-cf-field-label' ).val();
				if ( !label ) {
					label = table.find( '.smart-cf-field-name' ).val();
				}
				table.fadeOut( 'fast', function() {
					$( this ).addClass( 'hide' );
					btn_remove_field_slide.find( 'span' ).text( label );
				} );
			}
		} );

		/**
		 * グループ追加ボタン
		 */
		btn_add_group.click( function() {
			cnt ++;
			var group = wrapper.find( group_class );
			var group_clone = group.first().clone( true, true );
			group.last().after( group_clone.fadeIn( 'fast', function() {
				$( this ).removeClass( 'hide' );
			} ) );

			var field = group_clone.find( field_class );
			var field_clone = field.first().clone( true, true );
			field.last().after( field_clone.removeClass( 'hide' ) );

			group_clone.find( 'input, select, textarea' ).each( function( i, e ) {
				$( this ).attr( 'name',
					$( this ).attr( 'name' ).replace(
						/^(smart-custom-fields)\[\d+\]/,
						'$1[' + cnt + ']'
					)
				);
			} );

			field_clone.find( 'input, select, textarea' ).each( function( i, e ) {
				$( this ).attr( 'name',
					$( this ).attr( 'name' ).replace(
						/^(smart-custom-fields)\[.+?\](\[fields\])\[\d+?\]/,
						'$1[' + cnt + ']$2[' + cnt + ']'
					)
				);
			} );
		} );

		/**
		 * グループ削除ボタン
		 */
		btn_remove_group.click( function() {
			$( this ).parents( group_class ).fadeOut( 'fast', function() {
				$( this ).remove();
			} );
		} );

		/**
		 * フィールド追加ボタン
		 */
		btn_add_field.click( function() {
			cnt ++;
			var group = $( this ).parents( group_class );
			var field = group.find( field_class );
			var clone = field.first().clone( true, true );
			field.last().after( clone.fadeIn( 'fast', function() {
				$( this ).removeClass( 'hide' );
			} ) );

			clone.find( 'input, select, textarea' ).each( function( i, e ) {
				$( this ).attr( 'name',
					$( this ).attr( 'name' ).replace(
						/^(smart-custom-fields\[.+?\]\[fields\])\[\d+?\]/,
						'$1[' + cnt + ']'
					)
				);
			} );
		} );

		/**
		 * フィールド削除ボタン
		 */
		btn_remove_field.click( function() {
			$( this ).parents( field_class ).fadeOut( 'fast', function() {
				$( this ).remove();
			} );
		} );

		/**
		 * 選択項目テキストエリア
		 */
		wrapper.find( '.smart-cf-field-select' ).change( function() {
			var field            = $( this ).parents( field_class );
			var option           = $( this ).val();
			var choices          = field.find( '.smart-cf-choices' );
			var choices_default  = field.find( '.smart-cf-choices-default' );
			var single_default   = field.find( '.smart-cf-single-default' );
			var textarea_default = field.find( '.smart-cf-textarea-default' );
			var post_type        = field.find( '.smart-cf-post-type' );

			if ( option === 'check' || option === 'select' || option === 'radio' ) {
				choices.removeClass( 'hide' );
			} else {
				choices.addClass( 'hide' );
			}

			if ( option === 'check' ) {
				choices_default.removeClass( 'hide' );
			} else {
				choices_default.addClass( 'hide' );
			}

			if ( option === 'text' || option === 'select' || option === 'radio' ) {
				single_default.removeClass( 'hide' );
			} else {
				single_default.addClass( 'hide' );
			}

			if ( option === 'textarea' || option === 'wysiwyg' ) {
				textarea_default.removeClass( 'hide' );
			} else {
				textarea_default.addClass( 'hide' );
			}

			if ( option === 'relation' ) {
				post_type.removeClass( 'hide' );
			} else {
				post_type.addClass( 'hide' );
			}
		} );

		/**
		 * リピートボタンクリック時
		 */
		wrapper.find( '.smart-cf-group-repeat input' ).click( function() {
			var group = $( this ).parents( group_class );
			var names = group.find( '.smart-cf-group-names' );
			var btn_add_field = group.find( '.btn-add-field' );
			if ( $( this ).prop( 'checked' ) ) {
				names.removeClass( 'hide' );
				btn_add_field.removeClass( 'hide' );
			} else {
				names.addClass( 'hide' );
				btn_add_field.addClass( 'hide' );
			}
		} );

		/**
		 * フィールド名入力ボックス
		 */
		wrapper.find( '.smart-cf-field-label' ).focus( function() {
			var field     = $( this ).parents( '.smart-cf-field' );
			var name_val  = field.find( '.smart-cf-field-name' ).val();
			var label_val = $( this ).val();
			if ( name_val && !label_val ) {
				$( this ).val( name_val );
			}
		} );
	} );
} );