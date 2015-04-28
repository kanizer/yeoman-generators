define(['gen/utils/EventDispatcher'],
function(EventDispatcher)
{
	var VideoModel = function(options)
	{
        options = options || {};

		var _self = this,
		_options = options,
		_master = options.master,
		_stage = options.stage = options.master.stage,

		/**
			SAMPLE DATA FORMAT
	        _data = [
                {
                    id: '00',
                    coverImage: 'img/video_cover.jpg',
                    video: 'vid/video1', // strip out extension
                    metricsLabel: 'video1'
                },
            ];
		**/
		_data = options.data,

		_currentId = options.currentId,
		_currentIndex = options.currentIndex || 0,

		// dictionary to retrieve data objects by id
		_dictionary = {},

		// array to retrieve data objects by index
		_array = [];


		//----------------------------------------------------------------------
		//
		// PRIVATE METHODS
		//
		//----------------------------------------------------------------------
		function init()
		{
			if(_data === undefined)
			{
				throw new Error('snippets.videoplayer.VideoModel: No data defined.');
			}
			else
			{
				populateData();
			}
		}

		function populateData()
		{
            // create dictionary of video data objects
            var i, dto;
            for(i = 0; i < _data.length; i++)
            {
                dto = _data[i];
                _dictionary[dto.id] = {
                    path: dto.video,
                    coverImage: dto.coverImage,
                    metricsLabel: dto.metricsLabel
                };
                _array.push(dto);
            }

            // set default id
			if(_currentId === undefined)
			{
				_currentId = _array[_currentIndex].id;
			}
			// if id set and index is not
			else if(_options.currentIndex === undefined)
			{
				_currentIndex = _array.indexOf(_dictionary[_currentId]);
				if(_currentIndex === -1)
				{
					_currentIndex = 0;
					throw new Error('snippets.videoplayer.VideoModel.populateData(): _currentId sets _currentIndex to -1.');
				}
			}
		}


		//----------------------------------------------------------------
		// 
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------
		this.add = function(dto)
		{
			if(_dictionary[dto.id] === undefined){
				_dictionary[dto.id] = dto;
				_array.push(dto);
			}
			else throw new Error('snippets.videoplayer.VideoModel.add(): This dto id already exists.');
		};

		this.remove = function(dto)
		{
			if(_dictionary[dto.id] !== undefined){
				delete _dictionary[dto.id];

				var tarIndex = _array.indexOf(dto);
				if(tarIndex > -1) _array.splice(tarIndex, 1);
			}
			else throw new Error('snippets.videoplayer.VideoModel.remove(): This dto id does not exist.');
		};


		//----------------------------------------------------------------------
		//
		// GETTERS/SETTERS
		//
		//----------------------------------------------------------------------
		this.getIndex = function()
		{
			return _currentIndex;
		};

		this.setIndex = function(val)
		{
			_currentIndex = val;
			_currentId = _array[_currentIndex].id;
			
			EventDispatcher.dispatch(_stage.container.el, 'VIDEO_PLAYER_INDEX_CHANGED', {index: _currentIndex});
		};
	
		this.getId = function()
		{
			return _currentId;
		};

		this.setId = function(val)
		{
			_currentId = val;
			_currentIndex = _array.indexOf(_dictionary[_currentId]);

			if(_currentIndex === -1)
			{
				_currentIndex = 0;
				throw new Error('snippets.videoplayer.VideoModel.populateData(): _currentId sets _currentIndex to -1.');
			}

			EventDispatcher.dispatch(_stage.container.el, 'VIDEO_PLAYER_INDEX_CHANGED', {index: _currentIndex});
		};
	
		this.getDtoById = function(id)
		{
			return _dictionary[id];
		};
	
		this.getDtoByIndex = function(ind)
		{
			return _array[ind];
		};
	
		this.getLength = function()
		{
			return _array.length;
		};


		//----------------------------------------------------------------------
		//
		// INIT
		//
		//----------------------------------------------------------------------
		init();

	};

	return VideoModel;
});