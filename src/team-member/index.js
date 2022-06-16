import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';

registerBlockType('gutenberg-block/team-member', {
	title: __('Team Member', 'team-members'),
	description: __('A team member item', 'team-members'),
	icon: 'admin-users',
	parent: ['gutenberg-block/team-members'],
	supports: {
		reusable: false,
		html: false,
	},
	attributes: {
		name: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		bio: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		id:{
			type: 'number',
		},
		alt:{
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute:'alt',
			default:'',
		},
		url:{
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute:'src',
		},
		socialLinks:{
			type: 'array',
			default: [],
			source: 'query',
			selector: '.wp-block-gutenberg-block-team-members-social-links ul li',
			query:{
				icon:{
					source:'attribute',
					attribute: 'data-icon'
				},
				link:{
					source:'attribute',
					attribute:'href',
					selector:'a',

				},
			},
		},
	},
	edit: Edit,
	save: Save,
});
