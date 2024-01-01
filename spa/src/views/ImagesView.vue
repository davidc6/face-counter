
<template>
  <main v-if="isAuthed == true">
    <div>
      <h1>Upload files</h1>
      <div>
        <div class="btn-row">
          <input type="text" name="filename" ref="filename" @blur="setFilename" placeholder="Enter file name" />
        </div>

        <div class="btn-row">
          <label>
            <input type="file" accept="image/*" ref="file" @change="selectImage" />
          </label>
        </div>

        <div class="btn-row">
          <button class="btn btn-success btn-sm float-right" @click="uploadImage">
            Upload
          </button>
        </div>
      </div>

      <div class="files" v-if="files.length">
        <h2>Uploads</h2>
        <ul>
          <li v-for="item in files">
            <div class="item">
              <span>{{ item.name }}</span>
              <span>{{ item.status }}</span>
            </div>
            <div class="item-info" v-if="item.info?.faceCount">
              Face count: {{ item.info?.faceCount }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script>
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { request } from "../utils/request";

export default {
  name: "App",
  data() {
    return {
      isAuthed: false,
      currentFile: undefined,
      currentDesc: undefined,
      files: []
    };
  },
  methods: {
    selectImage(e) {
      this.file = e.target.files[0]
    },
    setFilename(e) {
      this.filename = e.target.value
    },
    async uploadImage() {
      let formData = new FormData()
      formData.append("file_name", this.filename);
      formData.append("file", this.file)

      try {
        const token = sessionStorage.getItem("token")
        const response = await request("http://localhost:8000/api/images", token, {}, "post", formData)
        this.files.push(response.data)
        // reset fields
        this.$refs.file.value = null
        this.$refs.filename.value = null
      } catch (e) {
        console.log(e)
      }
    },
    async eventSource(files) {
      return fetchEventSource(`http://localhost:8000/api/images/sse`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
        onopen(res) {
          if (res.ok && res.status === 200) {
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          if (event.data.length > 1) {
            const parsedData = JSON.parse(event.data)
            const indexToUpdate = files.findIndex((file) => file.name == parsedData.name)
            files[indexToUpdate] = parsedData
          }
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
      })
    }
  },
  async mounted() {
    const token = sessionStorage.getItem("token")

    try {
      const response = await request("http://localhost:8000/api/user", token)

      if (response.ok) {
        this.isAuthed = true;
        this.files = response?.data?.images;

        await this.eventSource(this.files)
      } else {
        this.$router.push("/sign-in")
      }
    } catch (e) {
      console.log('BA', e)
      this.$router.push("/sign-in")
    }
  }
}
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 4px;
}

li {
  padding: 6px;
}

li:nth-child(odd) {
  background-color: #242424;
}

.files {
  margin-top: 16px;
}

.item {
  display: flex;
  justify-content: space-between;
}

.btn-row {
  margin-top: 2px;
}
</style>