import { registerBlockType } from '@wordpress/blocks';
import './team-member';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType('gutenberg-block/team-members', {
	edit: Edit,
	save,
});
