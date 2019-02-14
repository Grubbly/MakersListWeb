<template>
    <v-layout>
        <v-flex xs4 sm4 offset-sm3>
        <v-card>
            <v-container grid-list-sm fluid grey lighten-3>
            <v-layout row wrap>
                <v-flex
                v-for="n in 9"
                :key="n"
                xs4
                d-flex
                >
                <v-card flat tile class="d-flex">
                    <v-img
                    :src="`https://picsum.photos/500/300?image=${n * 2 + 50}`"
                    :lazy-src="`https://picsum.photos/10/6?image=${n * 2 + 50}`"
                    aspect-ratio="1"
                    class="cyan darken-4"
                    >
                    <v-layout
                        slot="placeholder"
                        fill-height
                        align-center
                        justify-center
                        ma-0
                    >
                        <v-progress-circular indeterminate color="cyan"></v-progress-circular>
                    </v-layout>
                    </v-img>
                </v-card>
                </v-flex>
            </v-layout>
            </v-container>
        </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: 'TileGallery',
    data() {
        return {

        }
    }
}
</script>

<style>

</style>
