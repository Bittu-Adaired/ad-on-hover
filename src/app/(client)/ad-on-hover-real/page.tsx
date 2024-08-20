
import { Metadata } from 'next'
import DefaultPageTextComponent from '../_common_components/default-page-text-component'
import PlayerExampleSectionComponent from '../_common_components/player-example-section-component'


import NoSsr from '@/app/_common-components/no-ssr'

export const metadata: Metadata = {
  title: 'Reklama paspaudus grojimo mygtuką garsėja teksto įgarsinimo grotuvas',
  description: 'Lengva grotuvo įgarsinimo instrukcija',
}

export default function PlayerWithAdHoverPlayer() {
  return (
    <DefaultPageTextComponent>

      <PlayerExampleSectionComponent>
        <NoSsr>
          <div id="garseja-audio-player"
            style={{ width: '100%', height: '280px' }}
            data-voice="aira"
            data-theme-id="default"
            data-user-uuid="e5401940-0c6d-4af8-b126-a30565b22350"
            data-ad-type="HOVER_PLAYER"
            data-video-ad-url="https://pubads.g.doubleclick.net/gampad/ads?iu=/147246189,22572734674/telefonai.eu_instream_garseja&description_url=https%3A%2F%2Ftelefonai.eu%2F&tfcd=0&npa=0&sz=300x250&min_ad_duration=5000&max_ad_duration=120000&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator="
          >
          </div>
        </NoSsr>
      </PlayerExampleSectionComponent>

    </DefaultPageTextComponent>
  )
}

