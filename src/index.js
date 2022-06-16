import { registerBlockType, createBlock } from '@wordpress/blocks';
import './team-member';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType('gutenberg-block/team-members', {
	edit: Edit,
	save,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				isMultiBlock: true,
				transform: ( attributes ) => {
					const innerBlocks = attributes.map(
						( { url, id, alt } ) => {
							return createBlock( 'gutenberg-block/team-member', {
								alt,
								id,
								url,
							} );
						}
					);
					return createBlock(
						'gutenberg-block/team-members',
						{
							columns:
								attributes.length > 3 ? 3 : attributes.length,
						},
						innerBlocks
					);
				},
			},
		],
	},
});
