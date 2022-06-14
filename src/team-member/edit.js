import { useEffect, useState, useRef } from '@wordpress/element';
import { 
	RichText, 
	useBlockProps,
	 MediaPlaceholder,
	 BlockControls,
	 MediaReplaceFlow,
	 InspectorControls,
	 store as blockEditorStore
	} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { usePrevious } from '@wordpress/compose';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { 
	Spinner, 
	withNotices, 
	ToolbarButton, 
	PanelBody, 
	TextareaControl,
	SelectControl,
	Icon,
	Tooltip
} from '@wordpress/components';

function Edit({ 
	attributes, 
	setAttributes, 
	noticeOperations, 
	noticeUI, 
	isSelected 
}) {
	const { name, bio, url, alt, id, socialLinks } = attributes;
	const [blobURL, setBlobURL] = useState();
	const [selectedLink, setSelectedLink] = useState();

	const prevURL = usePrevious(url);
	const prevIsSelected = usePrevious(isSelected);

	const titleRef = useRef();

	const imageObject = useSelect(( select ) => {
		const { getMedia } = select("core");
		return id ? getMedia(id) : null;
	}, [id] );

	const imageSizes = useSelect((select) => {
		return select(blockEditorStore).getSettings().imageSizes;
	}, [] );

	const getImageSizeOptions = () => {
		if(!imageObject) return [];
		const options = [];
		const sizes = imageObject.media_details.sizes;
		for (const key in sizes){
			const size = sizes[key];
			const imageSize = imageSizes.find(s => s.slug === key);
			if(imageSize){
				options.push({
					label: imageSize.name,
					value: size.source_url,
				});
			}
		}
		return options;
	};

	const onChangeName = (newName) => {
		setAttributes({ name: newName });
	};
	const onChangeBio = (newBio) => {
		setAttributes({ bio: newBio });
	};
	const onChangeAlt = (newAlt) => {
		setAttributes({ alt: newAlt});
	};
	const onSelectImage = (image) => {
		if(!image || !image.url){
			setAttributes({url: undefined, id: undefined, alt: '' });
			return;
		}
		setAttributes({ url: image.url, id: image.id, alt: image.alt});
	};

	const onSelectURL = ( newURL )  => {
		setAttributes({
			url: newURL,
			id: undefined,
			alt: ' ',
		});
	};

	const onChangeImageSize = (newURL) => {
		setAttributes({url: newURL});
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};
	
	const removeImage = () => {
		setAttributes({
			url: undefined,
			alt: '',
			id: undefined,
		});
	};

	const addNewSocialItem = () => {
		setAttributes({
			socialLinks: [...socialLinks, { icon: 'wordpress', link: '' }],
		});
		setSelectedLink( socialLinks.lenght );
	};

	useEffect(() => {
		if(!id && isBlobURL(url)){
			setAttributes({
				url: undefined,
				alt: '',
			})
		}
	}, [] );

	useEffect( () => {
		if(isBlobURL(url)){
			setBlobURL(url);
		}else{
			revokeBlobURL(blobURL);
			setBlobURL();
		}
	}, [ url ]);

	useEffect(() => {
		if(url && !prevURL){
			titleRef.current.focus();
		}
	},[ url, prevURL ]);

	useEffect(() => {
		if(prevIsSelected && !isSelected){
			setSelectedLink();
		}
	}, [isSelected, prevIsSelected])

	return (
		<>
		<InspectorControls>
			<PanelBody
				title={__('Image Setting', 'team-members')}
				>
					{id &&
					<SelectControl 
					label={__('Image Size', 'team-members')}
					options={ getImageSizeOptions() }
					value={ url }
					onChange={ onChangeImageSize }
					/>
					}
					{ url && !isBlobURL( url ) && ( 
						<TextareaControl 
						label={__('Alt Text', 'team-members')}
						value={ alt }
						onChange={onChangeAlt}
						help={__("Alternative text describes your image to people can't see it.", 'team-members')}
						/>
					)}
			</PanelBody>
		</InspectorControls>
		{ url && (
			<BlockControls group='inline'>
				<MediaReplaceFlow  
				name={__('Replace Image', 'team-members')}
					onSelect={onSelectImage}
					onSelectURL={onSelectURL}
					onError={onUploadError}
					accept='image/*'
					allowedTypes={['image']}
					mediaId={id}
					mediaURL={url}
				/>
				<ToolbarButton onClick={removeImage}>{__('Remove Image', 'team-members')}</ToolbarButton>
			</BlockControls>
		)}
		<div {...useBlockProps()}>
			{ url && <div className={`wp-block-gutenberg-block-team-members-img${isBlobURL(url) ? ' is-loading': ' '}`}>
				<img src={url} alt={alt} />
				{ isBlobURL(url) && <Spinner /> }
				</div> }
			<MediaPlaceholder 
			icon="admin-users" 
			onSelect={onSelectImage}
			onSelectURL={onSelectURL}
			onError={onUploadError}
			accept='image/*'
			allowedTypes={['image']}
			disableMediaButtons={ url }
			notices={noticeUI}
			/>
			<RichText
			ref={ titleRef }
				placeholder={__('Member Name', 'team-members')}
				tagName="h4"
				onChange={onChangeName}
				value={name}
				allowedFormats={[]}
			/>
			<RichText
				placeholder={__('Member Bio', 'team-members')}
				tagName="p"
				onChange={onChangeBio}
				value={bio}
				allowedFormats={[]}
			/>

			<div className='wp-block-gutenberg-block-team-members-social-links'>
				<ul>
					{socialLinks.map((item, index) => {
						return (
							<li key={index} className={selectedLink === index ? 'is-selected' : null }>
								<button aria-label={__('Edit Social Link', 'team-members' )}
								onClick={() => 
									setSelectedLink (index)
								}
								>
									<Icon icon={ item.icon } />
								</button>
							</li>
						)
					})}

					{isSelected && (
					<li className='wp-block-gutenberg-block-team-members-add-icon-li'>
						<Tooltip text={__('Add Social Link', 'team-members' )}>
							<button 
							aria-label={__(
								'Add Social Link', 
								'team-members' 
								)}
							onClick={ addNewSocialItem } 
							>
								<Icon icon='plus'/>
							</button>
						</Tooltip>
					</li>
					)}
				</ul>
			</div>
		</div>
		</>
	);
}

export default withNotices ( Edit );