const firebase = require('firebase-admin');
const jwt = require('jsonwebtoken');
const utils = require('../../utils');
const { deleteConversation } = require('./util');

const db = firebase.firestore();

/**
 * firebase controler
 * 1. get member
 * 2. login member
 * 3. create member
 * 4. delete member
 */

const firebaseController = {
  // get_member
  get_member: (req, res) => {
    // console.log('ddsasdas', req.headers.authorization);

    // const bearToken = req.headers.authorization;
    // if (typeof bearToken === 'undefined') {
    //   return res
    //     .status(500)
    //     .json({ status: false, message: 'No authentication' });
    // }

    // const tokenRes = bearToken.split(' ')[1];

    // return jwt.verify(tokenRes, process.env.SECRET_KEY, (error, decode) => {
    //   if (error)
    //     return res
    //       .status(500)
    //       .json({ status: false, message: 'No authentication' });

    const { uid } = req;
    // const { uid } = decode;

    return db
      .collection('users')
      .doc(uid)
      .get()
      .then(response => {
        if (!response && response.error) {
          return res
            .status(404)
            .json({ status: false, message: 'Tài khoản không tồn tại' });
        }

        const userRes = response.data();

        return db
          .collection('users')
          .doc(userRes.shopId)
          .get()
          .then(resShop => {
            if (!resShop || resShop.error) {
              return res
                .status(404)
                .json({ status: false, message: 'Shop không tồn tại' });
            }

            const token = jwt.sign(
              {
                uid: userRes.uid,
              },
              process.env.SECRET_KEY
            );

            const user = {
              ...resShop.data(),
              ...userRes,
              token,
            };

            return res.json({ status: true, user });
          });
      })
      .catch(() => {
        return res
          .status(404)
          .json({ status: false, message: 'Tài khoản không tồn tại' });
      });
    // });
  },

  // login_member
  login_member: async (req, res) => {
    const { email, password } = req.body;

    return (
      db
        .collection('users')
        .where('email', '==', email)
        //      .where('password', '==', password)
        .get()
        .then(response => {
          // not user
          if (response.empty) {
            return res
              .status(500)
              .json({ status: false, message: 'Tài khoản không tồn tại' });
          }

          // has response user

          const userRes = response.docs[0].data();
          const { password_hash, ...restUser } = userRes;

          // check password
          const isValidPassword = utils.password.password_valid(
            password,
            password_hash
          );
          // if password not valid
          if (!isValidPassword) {
            return res
              .status(500)
              .json({ status: false, error: 'Mật khẩu không đúng' });
          }
          // if password valid
          // get shop

          return db
            .collection('users')
            .doc(userRes.shopId)
            .get()
            .then(shopRes => {
              if (shopRes.empty) {
                return res
                  .status(404)
                  .json({ status: false, error: 'Shop không tồn tại' });
              }

              // create token
              const token = jwt.sign(
                {
                  uid: response.docs[0].id,
                },
                process.env.SECRET_KEY
              );

              const user = { ...shopRes.data(), ...restUser, token };

              return res.json({ status: true, user });
            });
        })
    );
  },

  // create_member
  create_member: async (req, res) => {
    const { uid, shopId, email, so_dien_thoai, mat_khau, ho_va_ten } = req.body;

    try {
      const response = await db
        .collection('users')
        .doc(uid)
        .get();

      if (response.empty) {
        return res
          .status(404)
          .json({ status: false, error: 'Bạn không có quyền quản trị' });
      }

      const user = response.data();

      if (user.role !== 'admin') {
        return res
          .status(500)
          .json({ status: false, message: 'Bạn không có quyền quản trị' });
      }

      if (user.shopId !== shopId)
        return res
          .status(500)
          .json({ status: false, message: 'Bạn không phải chủ shop' });

      return firebase
        .auth()
        .createUser({
          email,
          password: mat_khau,
          displayName: ho_va_ten,
        })
        .then(newUserRes => {
          const password_hash = utils.password.password_hash(mat_khau);

          db.collection('users')
            .doc(newUserRes.uid)
            .set({
              password_hash,
              displayName: ho_va_ten,
              email,
              init: true,
              phoneNumber: so_dien_thoai,
              photoURL: '',
              type: 'customer',
              role: 'member',
              uid: newUserRes.uid,
              shopId: user.shopId,
            })
            .then(() =>
              res.json({ status: true, message: 'Đã tạo nhân viên thành công' })
            )
            .catch(() => {
              return res
                .status(500)
                .json({ status: false, error: 'Lỗi tạo nhân viên' });
            });
        });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  },

  // delete member
  delete_member: async (req, res) => {
    const { uid, adminId, shopId } = req.body;

    try {
      const resAmdin = await db
        .collection('users')
        .doc(adminId)
        .get();

      const adminInfo = resAmdin.data();

      if (adminInfo.role !== 'admin' || adminInfo.shopId !== shopId)
        return res
          .status(500)
          .json({ status: 'false', message: 'Không có quyền xóa' });

      await firebase.auth().deleteUser(uid);
      await db
        .collection('users')
        .doc(uid)
        .delete();
      return res.json({ status: true, message: 'Đã xóa nhân viên' });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  // delete_conversation
  delete_conversation: async (req, res) => {
    const { key, type } = req.body;
    const collection = type === 'message' ? 'messages' : 'comments';

    deleteConversation({ db, key, collection })
      .then(() => {
        return res.status(200).json({ status: true });
      })
      .catch(error => {
        return res.status(500).json({ status: false, error });
      });
  },

  // remove page actived
  remove_page_active: (req, res) => {
    const { shopId } = req.body;
  },
};

module.exports = firebaseController;
