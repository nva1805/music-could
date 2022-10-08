const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)
        
        const songName = $('.song-name');
        const songAvt = $('.cd img');
        const songAvtRotate = $('.cd')
        const audio = $('.audio');
        const playList = $('.list-song-position')
        const playBtn = $('.tool .play')
        const playingBtn = $('.tool .playing')
        const _this = this
        const backBtn = $('.back')
        const nextBtn = $('.next')
        const progress = $('.progress')
        const randomBtn = $('.random')     
        const repeatBtn = $('.repeat')



        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            isChoose: false,
            song: [
                {
                    name: 'Summer Time',
                    author: 'wibu',
                    path: './music/Summertime_Arrange_Nyan.mp3',
                    img: './picture/summerTime.png'
                },
                {
                    name: 'Quốc Ca Wibu',
                    author: 'wibu chúa',
                    path: './music/Renai_Circulation.mp3',
                    img: './picture/renai-Circulation.jpg'
                },
                {
                    name: 'Nandemonaiya',
                    author: 'Your Name OST',
                    path: './music/Nandemonaiya.mp3',
                    img: './picture/nandemonoya.jpg'
                },
                {
                    name: 'Play Date Cover',
                    author: '邢凯悦XKY',
                    path: './music/Play_Date_Cover_by_邢凯悦XKY.mp3',
                    img: './picture/play_date.png'
                }
            ],
            render: function() {
                const htmls = this.song.map((song, index) => {
                    return `
                <div class="list-song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                        <div class="song-cd">
                            <img src="${song.img}" alt="">
                        </div>
                        <div class="song-title">
                            <div class="song-name">${song.name}</div>
                            <div class="song-author">${song.author}</div>
                        </div>
                        <div class="song-love">
                            <div class="song-love-fChild">
                                <i class="fa-regular fa-heart"></i>
                            </div>
                            <div class="song-love-sChild">
                                <i class="fa-solid fa-heart"></i>
                            </div>
                        </div>
                </div>
                `
                })
                playList.innerHTML = htmls.join('')
            },

            // ---------handleEvent function-------------
            handleEvent: function(){
                // sử lí khi click vào play btn
                playBtn.onclick = function(){
                    if (_this.isPlaying) {
                        audio.pause();
                    }
                    else {
                    audio.play();
                    }
                }
                audio.onplay = function() {
                    _this.isPlaying = true;
                    playBtn.classList.add('playing')
                    songAvtMove.play()
                }
                audio.onpause = function() {
                    _this.isPlaying = false;
                    playBtn.classList.remove('playing')
                    songAvtMove.pause()
                }

                // chạy độ dài song % va render thoi gian phat
                audio.ontimeupdate = function(){
                    if (audio.duration) {
                        const progressPercent = (audio.currentTime/audio.duration *100)
                        progress.value = progressPercent;
                        // songTime = audio.duration
                        // console.log(songTime)
                        // console.log(audio.currentTime)  --------------------------hien thi thoi gian-------------
                    }

                    // su li render thoi gian bai hat
                    const currentTimeNow = $('.currentTimeNow')
                    const durationTimeNow = $('.durationTimeNow')
                    let currMinuteTime = Math.floor((audio.currentTime / 60))
                    let currSecTime = Math.floor((audio.currentTime - (currMinuteTime*60)))


                    if (currMinuteTime < 10) {
                        currMinuteTime = `0${currMinuteTime}`
                    }
                    if (currSecTime < 10) {
                        currSecTime = `0${currSecTime}`
                        }


                    const minuteTime = Math.floor(audio.duration / 60)
                    currentTimeNow.innerHTML = `${currMinuteTime} : ${currSecTime}`
                    durationTimeNow.innerHTML = `${minuteTime} : ${Math.floor(audio.duration) - minuteTime*60}`
                }
                // audio.onloadedata = function() {
                // }

                //   tua song
                progress.oninput = function(e) {
                        const seekTime = (e.target.value / 100 * audio.duration)
                        audio.currentTime = seekTime;
                    }

                // quay đĩa cd avt img
                const songAvtMove = songAvtRotate.animate([{transform: 'rotate(360deg)'}], {
                    duration: 10000, //thoi gian quay 1 vong la 10s
                    iterations: Infinity // so vong quay = vo han(interation)
                })
                songAvtMove.pause()

                // click next button
                nextBtn.onclick = function() {
                    if (_this.isRandom) {
                        app.playRandomSong()
                    } else {
                        app.nextSong()
                    }
                    audio.play()
                    app.render()
                }

                // click pre button
                backBtn.onclick = () => {
                    if (_this.isRandom) {
                        app.playRandomSong()
                    } else {
                        this.preSong()
                    }
                    audio.play()
                    app.render()
                    app.scrollToView()
                }

                // click random
                randomBtn.onclick = function() {
                    _this.isRandom = !_this.isRandom
                    randomBtn.classList.toggle('active', _this.isRandom)
                }


                // click repeat button
                repeatBtn.onclick = () => {
                    _this.isRepeat = !_this.isRepeat
                    repeatBtn.classList.toggle('active', _this.isRepeat)
                }



                // next bai hat khi ended song
                audio.onended = function() {
                    if (_this.isRepeat){
                        audio.play()
                    } else {
                        nextBtn.click() // thuoc tinh click() giong nhu onclick nhung phan mem tu click
                    }
                }



                // click vao danh sach thi run song
                playList.onclick = (e) => {
                    const songNode = e.target.closest('.list-song:not(.active)')
                    if (songNode || e.target.closest('.song-love')){
                        // su li khi click vao song
                        if (songNode) {
                            app.currentIndex = Number(songNode.dataset.index)
                            app.loadCurrentSong()
                            audio.play()
                            app.render()
                        }
                        // su li click vao song-love
                        if (e.target.closest('.song-love')) {
                            // const songLoveFChid = $('.song-love-fChild')
                            // const songLoveSChid = $('.song-love-sChild')
                            // songLoveFChid.onclick = () => {
                            //     songLoveFChid.style.display = "none"
                            // }
                            // songLoveSChid.onclick = () => {
                            //     songLoveFChid.style.display = "none"
                            // }
                        }
                    }
                }



                // click choose in pc view
                $('.choose').onclick = function() {
                    if (!_this.isChoose) {
                        $('.background').style.display = "block"
                        _this.isChoose = !_this.isChoose
                    } else {
                        $('.background').style.display = "none"
                        _this.isChoose = !_this.isChoose
                    }
                }
            },


            // ----------define properties for object app----------
            defineProperties: function(){
                Object.defineProperty(this, 'currentSong', {
                    get: function(){
                        return this.song[this.currentIndex]
                    }
                })
            },


            // ----------load info of song is playing----------
            loadCurrentSong: function(){
                console.log(songName, songAvt, audio)

                songName.textContent = this.currentSong.name;
                songAvt.src = this.currentSong.img;
                audio.src = this.currentSong.path
            },



            // next Song
            nextSong: function() {
                this.currentIndex++;
                if (app.currentIndex >= app.song.length){
                    app.currentIndex = 0
                }
                console.log(this.currentIndex)
                app.loadCurrentSong()
            },


            // back pre Song
            preSong: function() {
                this.currentIndex--;
                if (app.currentIndex < 0){
                    app.currentIndex = app.song.length -1
                }
                console.log(this.currentIndex)
                app.loadCurrentSong()
            },


            // play random song
            playRandomSong: function() {
                let newIndex
                do {
                    newIndex = Math.floor(Math.random() * this.song.length)
                } while (newIndex === this.currentIndex);
                app.currentIndex = newIndex;
                this.loadCurrentSong()
            },



            // scroll list song when play song
            scrollToView: function() {
                $('.background .active').scrollIntoView()
            },



            // start app
            start: function() {
                // dinh nghia thuoc tinh
                this.defineProperties()

                this.handleEvent()
                this.render()

                // tai thong tin bai hat dau tien vai UI
                this.loadCurrentSong()
            }
        }
        app.start();