const axios = require('axios').default
const fs = require('fs')
const svgtofont = require('svgtofont')
const path = require('path')

;(async () => {
  const { data } = await axios.get('https://emojipedia.org/apple/ios-14.6/')

  if (data) {
    let links = data
                    .match(/src="\/static\/img\/lazy.svg" data-src="https:\/\/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com\/thumbs\/72\/apple\/285\/[^\.]+.png"/gi)
                    .map(
                      (e, i) => {
                        const link = e.replace(/src="\/static\/img\/lazy.svg" data-src="/, '')
                         .replace(/"/, '')
                         .replace(/72/, '240')

                        const unicode = link.match(/_[^\.]+/)[0]

                        const regexp = new RegExp('[^_]+'+unicode.match(/[^_]+$/)[0], 'gi')

                        const pre = unicode.match(regexp)

                        let unicodes = []

                        if (pre) {
                          unicodes = (pre + '-' + unicode.match(/[^_]+$/)[0]).split('-').reduce((ctx, e) => {
                            if (ctx[ctx.length - 1] !== e) {
                              ctx.push(e)
                            }
                            return ctx
                          }, []).map(e => parseInt('0x'+e))
                        } else {
                          unicodes = unicode
                                      .match(/[^_]+$/)[0]
                                      .split('-')
                                      .map(e => parseInt('0x'+e))
                        }

                        return {
                          link,
                          unicodes,
                          name: link.match(/285\/([^_]?)+(_?[-A-Za-z]+)/gi)[0].replace('285/', '').replace(/-/gi, ' ').replace(/_/gi, '-').toLowerCase(),
                          emoji: unicodes.map(e => String.fromCodePoint(e)).join('')
                        }
                      }
                    )

    //links = links.filter(e => e.link.match(/victory-hand_/)).map(e => e)

    fs.writeFileSync(
      __dirname+'/emoji.json',
      JSON.stringify(
        links.reduce((ctx, el) => {
          ctx[el.emoji] = el.name
          return ctx
        }, {})
      )
    )

    links.forEach(({ name }) => {
      fs.writeFileSync(__dirname+'/svg/'+name+'.svg', `<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H75V75H0V0Z" fill="#C4C4C4"/>
      </svg>`)
    })

    svgtofont({
      src: path.resolve(process.cwd(), 'svg'), // svg path
      dist: path.resolve(process.cwd(), 'font'),
      css: true,
      useNameAsUnicode: true,
    }).then(() => {
      console.log('done!')
    });

    for (let i = 0; i < links.length; i += 1) {
      console.log('Download: ', i + 1, '/', links.length)
      await axios({
        method: 'get',
        url: links[i].link,
        responseType: 'stream'
      }).then(function (response) {
        response.data.pipe(fs.createWriteStream(__dirname+"/emoji/"+links[i].name+".png"));
      }).catch(e => {
        console.log(links[i].link)
      })
    }
  }
})()
