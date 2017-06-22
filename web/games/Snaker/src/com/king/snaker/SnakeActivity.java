package com.king.snaker;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.king.snaker.widget.SnackView;
import com.king.snaker.widget.SnackView.Direction;
import com.king.snaker.widget.SnackView.OnGameRunningListener;

public class SnakeActivity extends Activity implements OnGameRunningListener {

	SnackView snakeView ;
	TextView mScore ;
	int totalScore ;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.setContentView(R.layout.activity_snake);
		
		snakeView = (SnackView) findViewById(R.id.snake);
		mScore = (TextView) findViewById(R.id.score);
		snakeView.setOnGameRunningListener(this);
	}
	
	
	public void onKeyDwon(View view) {
		switch (view.getId()) {
		case R.id.left:
			snakeView.setDirection(Direction.LEFT);
			break;
		case R.id.up:
			snakeView.setDirection(Direction.UP);
			break;
		case R.id.right:
			snakeView.setDirection(Direction.RIGHT);
			break;
		case R.id.down:
			snakeView.setDirection(Direction.DOWN);
			break;
		case R.id.start:
			snakeView.onStartMove();
			break;
		case R.id.pause:
			snakeView.onPauseMove();
			break;
		case R.id.restart:
			snakeView.onRestart();
			totalScore = 0 ;
			onGetScore(0);
			break;
		}
	}


	@Override
	public void onGetScore(int score) {
		totalScore += score ;
		mScore.setText("当前分数:"+totalScore);
	}

	@Override
	public void onGameOver() {
		Toast.makeText(SnakeActivity.this, "游戏结束！", Toast.LENGTH_LONG).show();
	}
}
