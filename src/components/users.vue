<template >
  <div class="container mt-2">
    <div class="d-flex pb-2 justify-content-between">
      <h2 class="m-0">Users</h2>
      <button class="btn btn-info border-0 col-2" @click='createUser'>Add user</button>
    </div>
    <div class="p-20">
      <div class="d-flex mb-2">
        <select v-model="searchField" class="form-control col-4">
          <option value="" disabled selected>Choose search field</option>
          <option v-for="header in columnsHeader" :value="header.key" :class="[{'d-none': header.key == 'actions'}]">
              {{ header.title }}
            </option>
        </select>
        <input type="text" class="form-control col-8" v-model="searchValue" placeholder="Search">
      </div>
      <table class="table table-hover text-center">
        <thead>
          <tr>
              <th v-for="header in columnsHeader" :key="header.key">
                {{ header.title }}
              </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filteredUsers" :key="row.id">
            <td v-for="td in columnsHeader" :key="td.id">
              {{ row[td.key] }}
              <span v-if="td.key === 'actions'">
                <div class="d-flex justify-content-center">
                  <a href="#">
                    <i class="fas fa-pen mr-2" @click="editUser(index)"></i>
                  </a>
                  <!-- <i class="fas fa-trash"></i> -->
                </div>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <modal  v-show="isModalVisible" @close="closeModal">
      <template v-slot:header>
        <h2 v-if='!!formData.id'>Edit</h2>
        <h2 v-else>New user</h2>
      </template>
      <template v-slot:body>
        <form @submit.prevent="saveUser" id="UsersForm">
          <div class="form-group col-12">
            <label for="inputFirstName">First name</label>
            <input type="text" class="form-control" id="inputFirstName" placeholder="First name" v-model="formData.firstName" required>
          </div>
          <div class="form-group col-12">
            <label for="inputLastName">Last name</label>
            <input v-model="formData.lastName" type="text" class="form-control" id="inputLastName" placeholder="Last name" required>
          </div>
          <div class="form-group col-12">
            <label for="inputUsername">Username</label>
            <input v-model="formData.username" type="text" class="form-control" id="inputUsername" minlength="4" maxlength="5" placeholder="Username" :readonly="!!formData.id">
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <div class="form-group d-flex justify-content-between col-12">
          <button class="btn btn-info col-3" type="submit" form="UsersForm">Save</button>
          <button class="btn btn-secondary col-3" type="submit" @click='closeModal'>Cancel</button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
  import fs from 'browserify-fs'
  export default {
    data: function () {
        var columnsHeader = [
          {title: 'First Name', key: 'firstName'},
          {title: 'Last Name', key: 'lastName'},
          {title: 'Username', key: 'username'},
          {title: 'Actions ', key: 'actions'}
        ]
        return {
          isModalVisible: false,
          searchValue: '',
          searchField: '',
          formData: {
            id: 0,
            firtName: '',
            lastName: '',
            username: '',
          },
          columnsHeader: columnsHeader,
          users: []
        }
    },
    methods: {
      getUsersList: function () {
         return require('../../data/users.json')
      },
      showModal () {
        this.isModalVisible = true
      },
      closeModal () {
        this.isModalVisible = false
      },
      refreshFormData () {
        this.formData = {
          id: 0,
          firtName: '',
          lastName: '',
          username: '',
        }
      },
      createUser () {
        this.refreshFormData()
        this.showModal()
      },
      editUser (index) {
        this.formData = JSON.parse(JSON.stringify(this.users[index]))
        this.showModal()
      },
      saveUser () {
        var ctx = this
        if (this.formData.id === 0) {
          var isUnique = true
          this.formData.id = this.users.length + 1
          this.users.forEach((user, index) => {
            if (user.username == ctx.formData.username) {
              isUnique = false
            }
          })
          if (!isUnique) {
            alert ("Username is not unique. Try again")
          } else {
            this.users.push(this.formData)
          }
        } else {
          var userIndex
          this.users.forEach((user, index) => {
            if (user.id == ctx.formData.id) {
              userIndex = index
            }
          })
          this.users[userIndex] = this.formData
        }
        // var fs = require('browserify-fs')
        fs.writeFile('/home/users.json', JSON.stringify(ctx.users), function() {
            fs.readFile('/home/users.json', 'utf-8', function(err, data) {
              ctx.users = JSON.parse(data)
              // console.log(data)
            })
        })
        this.closeModal()
      },
    }, // methods
    computed: {
      filteredUsers: function () {
        var ctx = this
        if (ctx.searchField.length > 0 && ctx.searchValue.length > 0) {
          return this.users.filter(user => {
            return user[ctx.searchField].toLowerCase().includes(ctx.searchValue.toLowerCase())
          })
        }
        return this.users
      }
    },
    mounted () {
      // this.users = this.getUsersList()
      var ctx = this
      // var fs = require('browserify-fs')
      fs.mkdir('/home', function() {
          fs.writeFile('/home/users.json', JSON.stringify(ctx.getUsersList()), function() {
              fs.readFile('/home/users.json', 'utf-8', function(err, data) {
                  ctx.users = JSON.parse(data)
              })
          })
      })
      // console.log(this.users)
    }
  } // export default
</script>
