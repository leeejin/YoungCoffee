// data.js

const data = [
    {
      postId: 1,
      postTitle: '이래이래해가지고',
      postContent: '내용이에요',
      postNickname: '초롱아롱',
      postUserId: 1,
      commentList: [
        {
          id: 0,
          content: '우와',
          nickname: '아롱초롱',
          postId: 1,
          userId: 2,
        },
      ],
    },
    {
        postId: 2,
        postTitle: '아 죽을 거같다',
        postContent: '내용이에요!!!!!!!!!!',
        postNickname: '아롱초롱',
        postUserId: 2,
        commentList: [
          {
            id: 0,
            content: 'ㄹㅇ 죽을 거같음',
            nickname: '초롱아롱',
            postId: 2,
            userId: 1,
          },{
            id: 1,
            content: '이제 내가 모르는거 남았누',
            nickname: '초롱아롱',
            postId: 2,
            userId: 1,
          },
        ],
      },
  
  ];
  
  export default data;