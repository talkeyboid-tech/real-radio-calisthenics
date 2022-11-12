module.exports = {
  getNewVideo() {
    return {
      correct: {
        id: 'XXX',
        title: 'テストタイトル',
        description: 'テスト詳細',
        view_count: 10,
        like_count: 20,
      },
      noRequiredProps: {
        title: 'テストタイトル',
        description: 'テスト詳細',
        view_count: 10,
        like_count: 20,
      },
      hasInvalidProps: {
        id: 'XXX',
        title: 'テストタイトル',
        description: 'テスト詳細',
        view_count: 10,
        like_count: 20,
        invalid: 'This is invalid',
      },
      notExists: {
        id: 'ZZZ',
        title: '存在しないテストタイトル',
        description: 'テスト詳細',
        view_count: 10,
        like_count: 20,
      },
    };
  },
};
